(() => {
  const TOTAL_VIDEOS = 7;
  const SPACING = 1.8;
  const MIN_SCALE = 0.5;
  const MIN_OPACITY = 0.8;

  let scene, camera, renderer, raycaster, pointer;
  const planes = [];
  const state = { index: 0 };
  let isHorizontal = false;

  init();

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    document.getElementById("container").appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    createPlanes();
    setupScroll();
    animate();

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("click", onClick, false);

    checkAspect(); 
  }

  function makeVideoMaterial(i, horizontal) {
    let videoEl;

    if (horizontal) {
      videoEl = document.createElement("video");
      videoEl.src = `SVG/nd_doc/nd_doc${i}.mp4`;
      videoEl.muted = true;
      videoEl.loop = true;
      videoEl.playsInline = true;
      videoEl.autoplay = true;
      videoEl.play().catch(err => console.log("Autoplay blocked:", err));
    } else {
      videoEl = document.getElementById("video" + i);
      if (videoEl) {
        videoEl.muted = true;
        videoEl.play().catch(err => console.log("Autoplay blocked:", err));
      }
    }

    if (!videoEl) {
      return new THREE.MeshBasicMaterial({ color: 0x000000 });
    }

    const videoTexture = new THREE.VideoTexture(videoEl);
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    return new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide,
      transparent: true,
    });
  }

  function createPlanes() {
    for (let i = 0; i < TOTAL_VIDEOS; i++) {
      const material = makeVideoMaterial(i, isHorizontal);
      const geometry = new THREE.PlaneGeometry(4, 2.25);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      planes.push(mesh);
    }
    updatePlanes(0);
  }

  function updatePlanes(floatIndex) {
    planes.forEach((mesh, i) => {
      const distance = Math.abs(i - floatIndex);

      const newW = isHorizontal ? 2.25 : 4;
      const newH = isHorizontal ? 4 : 2.25;
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(newW, newH);

      if (isHorizontal) {
        mesh.position.x = (i - floatIndex) * SPACING;
        mesh.position.y = 0;
        mesh.rotation.x = 0;
        mesh.rotation.y = (i === Math.round(floatIndex)) ? 0 : (i - floatIndex) * -1.0;
      } else {
        mesh.position.y = (i - floatIndex) * -SPACING;
        mesh.position.x = 0;
        mesh.rotation.x = (i === Math.round(floatIndex)) ? 0 : (i - floatIndex) * -2.0;
        mesh.rotation.y = 0;
      }

      mesh.scale.setScalar(Math.max(MIN_SCALE, 1 - distance * 0.4));
      mesh.material.opacity = Math.max(MIN_OPACITY, 1 - distance * 0.15);
    });

    camera.position.set(0, 0, 8);

    const texts = document.querySelectorAll(".plane-text");
    texts.forEach((el, i) => {
      el.classList.toggle("active", i === Math.round(floatIndex));
    });
  }

  function setupScroll() {
    ScrollTrigger.getAll().forEach(st => st.kill());

    if (isHorizontal) {
      setupSwipe();
    } else {
      ScrollTrigger.create({
        trigger: "#scroll-dist",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const rawIndex = self.progress * (TOTAL_VIDEOS - 1);
          gsap.to(state, {
            index: rawIndex,
            duration: 0.4,
            ease: "power3.out",
            overwrite: true,
            onUpdate: () => updatePlanes(state.index),
          });
        },
      });
    }
  }

  function setupSwipe() {
    let startX = 0;
    let isDown = false;

    const el = renderer.domElement;

    el.addEventListener("touchstart", e => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        isDown = true;
      }
    });

    el.addEventListener("touchend", e => {
      if (!isDown) return;
      isDown = false;

      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      if (Math.abs(diff) > 50) {
        if (diff < 0 && state.index < TOTAL_VIDEOS - 1) {
          state.index++;
        } else if (diff > 0 && state.index > 0) {
          state.index--;
        }
        gsap.to(state, {
          index: state.index,
          duration: 0.5,
          ease: "power3.out",
          onUpdate: () => updatePlanes(state.index),
        });
      }
    });
  }

  function onClick(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(planes);
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const index = planes.indexOf(clickedMesh);
      if (index !== -1) {
        window.location.href = `work${index + 1}.html`;
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    checkAspect();
  }

  function checkAspect() {
    const mq = window.matchMedia("(max-aspect-ratio: 16/9) and (max-width: 768px)");
    const newIsHorizontal = mq.matches;

    if (newIsHorizontal !== isHorizontal) {
      isHorizontal = newIsHorizontal;

      planes.forEach((mesh, i) => {
        mesh.material.dispose();
        mesh.material = makeVideoMaterial(i, isHorizontal);
      });

      setupScroll();
    }
    updatePlanes(state.index);
  }
})();
