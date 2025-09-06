  document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(InertiaPlugin);

  const $container = $("#dvd");
  const gridWidth = 150;
  const gridHeight = 150;
  const containerWidth = $container.width();
  const containerHeight = $container.height();

  const animations = {}; 
  const activeBoxes = {}; 

  function getRandomEdgePosition() {
    const edge = Math.floor(Math.random() * 4);
    let x = 0, y = 0;

    switch(edge) {
      case 0:
        x = Math.random() * (containerWidth - gridWidth);
        y = 0;
        break;
      case 1:
        x = containerWidth - gridWidth;
        y = Math.random() * (containerHeight - gridHeight);
        break;
      case 2:
        x = Math.random() * (containerWidth - gridWidth);
        y = containerHeight - gridHeight;
        break;
      case 3: 
        x = 0;
        y = Math.random() * (containerHeight - gridHeight);
        break;
    }

    return { x, y };
  }

  function moveToNextEdge(box) {
    if (!activeBoxes[box.id]) return; 

    const targetPos = getRandomEdgePosition();
    animations[box.id] = gsap.to(box, {
      x: targetPos.x,
      y: targetPos.y,
      duration: 2 + Math.random() * 2,
      ease: "power1.inOut",
      onComplete: () => moveToNextEdge(box)
    });
  }

  $(".box").each(function () {
    const box = this;
    activeBoxes[box.id] = true; 
    const start = getRandomEdgePosition();
    gsap.set(box, { x: start.x, y: start.y });
    moveToNextEdge(box);
  });

  
});

