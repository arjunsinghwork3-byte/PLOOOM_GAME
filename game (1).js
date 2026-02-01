document.addEventListener("DOMContentLoaded", () => {

const screens = {
  landing: landing,
  howTo: howTo,
  game: game,
  win: win,
  reward: reward
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let score = 0;
let active = false;
let balls = [];

const vendors = ["Caterers","Decorators","DJs","Musicians","Venues"];

const player = { x: 180, y: 540, w: 32, h: 32, speed: 6 };

startBtn.onclick = () => show("howTo");
playBtn.onclick = startGame;
rewardBtn.onclick = () => show("reward");

leftBtn.onclick = () => player.x -= player.speed;
rightBtn.onclick = () => player.x += player.speed;

document.addEventListener("keydown", e => {
  if (!active) return;
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
});

function show(name) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

function spawn() {
  balls.push({
    x: Math.random() * 340 + 20,
    y: 0,
    type: Math.random() > 0.3 ? "vendor" : "chaos",
    text: Math.random() > 0.3 ? vendors[Math.floor(Math.random()*vendors.length)] : "CHAOS",
    speed: 1
  });
}

function loop() {
  if (!active) return;
  ctx.clearRect(0,0,400,600);

  // Player (pixel style)
  ctx.fillStyle = "#0ff";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  balls.forEach(b => {
    b.y += b.speed;
    ctx.fillStyle = b.type === "vendor" ? "#f97316" : "#38bdf8";
    ctx.beginPath();
    ctx.arc(b.x, b.y, 18, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.font = "8px 'Press Start 2P'";
    ctx.fillText(b.text.substring(0,6), b.x-18, b.y+3);

    if (
      b.y > player.y &&
      b.x > player.x &&
      b.x < player.x + player.w
    ) {
      if (b.type === "vendor") {
        score += 10;
        scoreEl.textContent = score;
        if (score >= 100) winGame();
      }
      balls.splice(balls.indexOf(b),1);
    }
  });

  balls = balls.filter(b => b.y < 620);
  requestAnimationFrame(loop);
}

function startGame() {
  score = 0;
  balls = [];
  scoreEl.textContent = score;
  active = true;
  show("game");
  setInterval(() => active && spawn(), 1400);
  loop();
}

function winGame() {
  active = false;
  show("win");
}

show("landing");

});
