document.addEventListener("DOMContentLoaded", () => {

const screens = {
  landing: document.getElementById("landing"),
  howTo: document.getElementById("howTo"),
  game: document.getElementById("game"),
  win: document.getElementById("win"),
  lose: document.getElementById("lose"),
  reward: document.getElementById("reward")
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let active = false;
let balls = [];

const chaosWords = ["Pricing", "Delays", "Changes", "Overruns", "Compliance"];

const player = { x: 180, y: 540, w: 40, h: 40 };

document.getElementById("startBtn").onclick = () => show("howTo");
document.getElementById("playBtn").onclick = startGame;
document.getElementById("retryBtn").onclick = startGame;
document.getElementById("continueBtn").onclick = () => show("reward");
document.getElementById("rewardBtn").onclick = () => show("reward");

document.addEventListener("keydown", e => {
  if (!active) return;
  if (e.key === "ArrowLeft") player.x -= 10;
  if (e.key === "ArrowRight") player.x += 10;
});

function show(name) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

function spawn() {
  balls.push({
    x: Math.random() * 340 + 20,
    y: 0,
    type: Math.random() > 0.7 ? "ploomm" : "chaos",
    text: Math.random() > 0.7 ? "PLOOMM" : chaosWords[Math.floor(Math.random()*chaosWords.length)]
  });
}

function loop() {
  if (!active) return;
  ctx.clearRect(0,0,400,600);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  balls.forEach(b => {
    b.y += 1;
    ctx.beginPath();
    ctx.fillStyle = b.type === "ploomm" ? "#f97316" : "#0ea5e9";
    ctx.arc(b.x, b.y, 20, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillText(b.text, b.x-15, b.y+4);

    if (b.y > player.y && b.x > player.x && b.x < player.x+player.w) {
      b.type === "ploomm" ? win() : lose();
    }
  });

  balls = balls.filter(b => b.y < 620);
  requestAnimationFrame(loop);
}

function startGame() {
  balls = [];
  active = true;
  show("game");
  setInterval(() => active && spawn(), 1500);
  loop();
}

function win() { active = false; show("win"); }
function lose() { active = false; show("lose"); }

show("landing");

});
