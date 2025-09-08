
document.addEventListener("DOMContentLoaded", function () {
  function showPage() {
    const door = document.getElementById("door");
    const door1 = document.querySelector(".door1");
    const door2 = document.querySelector(".door2");

    let openedCount = 0;
    function onDoorOpened() {
      openedCount++;
      if (openedCount === 2) {
        door.style.transition = "opacity 1s ease";

        setTimeout(() => {
          door.style.display = "none";

          const elements = document.querySelectorAll(".load1, .load2, .load3");
          elements.forEach(el => el.classList.add("load"));
        }, 200); 
      }
    }

    door1.style.transition = "transform 1s ease";
    door2.style.transition = "transform 1s ease";

    door1.addEventListener("transitionend", onDoorOpened, { once: true });
    door2.addEventListener("transitionend", onDoorOpened, { once: true });

    door1.style.transform = "rotateY(-90deg)";
    door2.style.transform = "rotateY(90deg)";
  }

  window.onload = function () {
    showPage();
  };





const navTexts = document.querySelectorAll('nav li');
const tooltip = document.getElementById('tooltip');

navTexts.forEach(item => {
  item.addEventListener('mouseenter', (e) => {
    item.classList.add('hovered');

    // Hiện tooltip
    tooltip.style.display = 'block';
    tooltip.style.left = e.pageX + 20 + 'px'; 
    tooltip.style.top = e.pageY + 'px';
  });

  item.addEventListener('mousemove', (e) => {
    tooltip.style.left = e.pageX + 40 + 'px';
    tooltip.style.top = e.pageY + 'px';
  });

  item.addEventListener('mouseleave', () => {
    item.classList.remove('hovered');
    tooltip.style.display = 'none';
  });
});




const game = document.getElementById("game");
// =======================
// @nohurryhen
//https://qwook.io/events/htmlday2025/~nohurryhen/
// =======================
function createGrass() {
  game.querySelectorAll(".grass").forEach((g) => g.remove());

  const cols = 10;
  const rows = 10;

  const rect = game.getBoundingClientRect();
  const cellWidth = rect.width / cols;
  const cellHeight = rect.height / rows;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const grass = document.createElement("div");
      grass.className = "grass";

      grass.style.width = cellWidth + "px";
      grass.style.height = cellHeight + "px";

      // Vị trí theo grid
      grass.style.left = x * cellWidth + "px";
      grass.style.top = y * cellHeight + "px";

    
      grass.style.backgroundImage = `url("grass.svg")`;
      game.appendChild(grass);

      // Hover effect
      let grassTimeout;
      grass.addEventListener("mousemove", () => {
        grass.style.opacity = 0.2;
        if (grassTimeout) clearTimeout(grassTimeout);
        grassTimeout = setTimeout(() => {
          grass.style.opacity = 1;
        }, 20000);
      });
    }
  }
}

createGrass();
window.addEventListener("resize", createGrass);

// =======================
// SHOE + TEXT
// =======================
const text = `vô nhà bỏ dép ra có thờ có thiêng có kiêng có lành`.split(
  " "
);
let textIndex = 0;

const shoes = [];
let lastTime = 0;

game.addEventListener("mousemove", (e) => {
  const rect = game.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Chỉ spawn shoe trong #game
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

  for (let shoe of shoes) {
    if ((shoe.x - x) ** 2 + (shoe.y - y) ** 2 < 20000) {
      return;
    }
  }

  // Tạo shoe mới
  const shoe = document.createElement("div");
  shoe.className = "shoe";
  shoe.style.transform = `translate(${x - rect.width * 0.06}px, ${
    y - rect.height * 0.1
  }px) rotate(${Math.random() * 360}deg)`;
  shoe.style.backgroundImage = `url("shoe${Math.floor(
    Math.random() * 19 + 1
  )}.svg")`;

  shoe.x = x;
  shoe.y = y;

  shoes.push(shoe);
  game.appendChild(shoe);

  setTimeout(() => {
    shoe.innerText = text[textIndex];
    textIndex = (textIndex + 1) % text.length;
    shoe.style.transform = `translate(${shoe.x - rect.width * 0.06}px, ${
      shoe.y - rect.height * 0.1
    }px) rotate(${Math.random() * 10 - 5}deg)`;
  }, 500);

  setTimeout(() => {
    if (game.contains(shoe)) {
      game.removeChild(shoe);
      shoes.splice(shoes.indexOf(shoe), 1);
    }
  }, 4500);

  lastTime = Date.now() + 100;
});

});


// worknavbar
// ============================
// ============================
const details = document.querySelector('nav');
const workPage = document.querySelector('.work_page');
let lastScrollTop = 0;

function showDetails() {
  details.style.display = 'flex';
}

function hideDetails() {
  details.style.display = 'none';
}

workPage.addEventListener('scroll', () => {
  const currentScroll = workPage.scrollTop;

  if (currentScroll > lastScrollTop) {
    hideDetails();
  } else {
    showDetails();
  }

  lastScrollTop = Math.max(currentScroll, 0);
});

showDetails();



// ====================================
// ====================================
function entersWorkPageBy25Percent(element) {
  const elementRect = element.getBoundingClientRect();
  const workPageRect = workPage.getBoundingClientRect();

  return (
    elementRect.top <= workPageRect.bottom - workPageRect.height * 0.25 &&
    elementRect.bottom >= workPageRect.top + workPageRect.height * 0.25
  );
}

function handleScroll() {
  const entries = document.querySelectorAll('.entry');

  entries.forEach(entry => {
    if (entersWorkPageBy25Percent(entry)) {
      entry.classList.add('visible');
    }
  });
}

workPage.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);


// ===========================
// ===========================
const nutBackToTop = document.querySelector('.backtotop');

function toggleBackToTop() {
  if (workPage.scrollTop > 300) {
    nutBackToTop.classList.add('show');
  } else {
    nutBackToTop.classList.remove('show');
  }
}

workPage.addEventListener('scroll', toggleBackToTop);

nutBackToTop.addEventListener('click', () => {
  workPage.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

toggleBackToTop();

