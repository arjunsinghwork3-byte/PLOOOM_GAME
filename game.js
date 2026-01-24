const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const overlay = document.getElementById("overlay");
const rewardScreen = document.getElementById("rewardScreen");

let gameRunning = false;
let score = 0;

const eventLabels = [
  "Caterers",
  "Decorators",
  "DJs",
  "Musicians",
  "AV Teams",
  "Lighting",
  "Venues"
];

const player = {
  x: canvas.width / 2 - 16,
  y: canvas.height - 60,
  size: 32,
  speed: 5
};

let objects = [];
let spawnInterval;
let gameLoopId;

startBtn.onclick = () => {
  overlay.style.display = "none";
  startGame();
};

function startGame() {
  score = 0;
  objects = [];
  gameRunning = true;
  spawnInterval = setInterval(spawnObject, 1200);
  gameLoop();
}

function spawnObject() {
  const isEvent = Math.random() < 0.7;
  objects.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    size: 40,
    speed: 1.5 + Math.random(),
    type: isEvent ? "event" : "chaos",
    label: isEvent
      ? eventLabels[Math.floor(Math.random() * eventLabels.length)]
      : ""
  });
}

function update() {
  objects.forEach((obj, index) => {
    obj.y += obj.speed;

    if (collision(player, obj)) {
      if (obj.type === "event") {
        score += 10;
        objects.splice(index, 1);
        if (score >= 100) {
          winGame();
        }
      } else {
        endGame();
      }
    }
  });

  objects = objects.filter(obj => obj.y < canvas.height + 50);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1f4fa3";
  ctx.font = "14px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);

  drawPixelPlayer(player.x, player.y);

  objects.forEach(obj => {
    ctx.fillStyle = obj.type === "event" ? "orange" : "black";
    ctx.beginPath();
    ctx.arc(obj.x + obj.size / 2, obj.y + obj.size / 2, obj.size / 2, 0, Math.PI * 2);
    ctx.fill();

    if (obj.type === "event") {
      ctx.fillStyle = "white";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(obj.label, obj.x + obj.size / 2, obj.y + obj.size / 2 + 3);
    }
  });
}

function drawPixelPlayer(x, y) {
  ctx.fillStyle = "#1f4fa3";
  const pixel = 4;
  const sprite = [
    [0,1,1,1,0],
    [1,1,1,1,1],
    [0,1,1,1,0],
    [1,0,1,0,1],
    [1,0,1,0,1]
  ];
  sprite.forEach((row, r) => {
    row.forEach((col, c) => {
      if (col) ctx.fillRect(x + c * pixel, y + r * pixel, pixel, pixel);
    });
  });
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  clearInterval(spawnInterval);
  overlay.style.display = "flex";
  overlay.innerHTML = `<h1>GAME OVER</h1><p>Score: ${score}</p><button onclick="location.reload()">RESTART</button>`;
}

function winGame() {
  gameRunning = false;
  clearInterval(spawnInterval);
  rewardScreen.classList.remove("hidden");
}

function collision(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.x = Math.max(0, player.x - player.speed);
  if (e.key === "ArrowRight") player.x = Math.min(canvas.width - player.size, player.x + player.speed);
});
