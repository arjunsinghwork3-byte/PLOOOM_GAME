const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const overlay = document.getElementById("overlay");

let gameRunning = false;

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 60,
  width: 40,
  height: 40,
  speed: 6
};

let objects = [];
let spawnInterval;
let gameLoopId;

startBtn.onclick = () => {
  overlay.style.display = "none";
  startGame();
};

function startGame() {
  objects = [];
  gameRunning = true;
  spawnInterval = setInterval(spawnObject, 800);
  gameLoop();
}

function spawnObject() {
  const isPloomm = Math.random() < 0.15;
  objects.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    size: 30,
    speed: 3 + Math.random() * 2,
    type: isPloomm ? "ploomm" : "chaos"
  });
}

function update() {
  objects.forEach(obj => {
    obj.y += obj.speed;

    if (collision(player, obj)) {
      if (obj.type === "ploomm") {
        endGame("YOU WIN!");
      } else {
        endGame("GAME OVER");
      }
    }
  });

  objects = objects.filter(obj => obj.y < canvas.height + 50);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1f4fa3";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  objects.forEach(obj => {
    ctx.fillStyle = obj.type === "ploomm" ? "orange" : "black";
    ctx.beginPath();
    ctx.arc(obj.x + obj.size / 2, obj.y + obj.size / 2, obj.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function endGame(message) {
  gameRunning = false;
  clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoopId);
  overlay.style.display = "flex";
  overlay.innerHTML = `<h1>${message}</h1><button onclick="location.reload()">RESTART</button>`;
}

function collision(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.width > b.x &&
    a.y < b.y + b.size &&
    a.y + a.height > b.y
  );
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
});
