document.addEventListener("DOMContentLoaded", () => {

  const startScreen = document.getElementById("startScreen");
  const rewardScreen = document.getElementById("rewardScreen");
  const gameUI = document.getElementById("gameUI");
  const startBtn = document.getElementById("startBtn");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");

  let score = 0;
  let gameActive = false;
  let balls = [];

  const labels = ["Caterers", "Decorators", "DJs", "Musicians", "Venues"];

  const player = {
    x: 180,
    y: 540,
    width: 40,
    height: 40,
    speed: 6
  };

  document.addEventListener("keydown", e => {
    if (!gameActive) return;
    if (e.key === "ArrowLeft") player.x -= player.speed;
    if (e.key === "ArrowRight") player.x += player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  });

  function spawnBall() {
    balls.push({
      x: Math.random() * 320 + 20,
      y: 0,
      radius: 22,
      text: labels[Math.floor(Math.random() * labels.length)],
      speed: 1.2
    });
  }

  function drawPlayer() {
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  function drawBalls() {
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    balls.forEach(b => {
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.fillText(b.text, b.x, b.y + 3);
    });
  }

  function updateBalls() {
    balls.forEach(b => b.y += b.speed);
    balls = balls.filter(b => b.y < canvas.height + 30);
  }

  function checkCollisions() {
    balls = balls.filter(b => {
      const hit =
        b.x > player.x &&
        b.x < player.x + player.width &&
        b.y > player.y &&
        b.y < player.y + player.height;

      if (hit) {
        score += 10;
        scoreEl.textContent = score;
        if (score >= 100) endGame();
        return false;
      }
      return true;
    });
  }

  function gameLoop() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBalls();
    updateBalls();
    checkCollisions();
    requestAnimationFrame(gameLoop);
  }

  function startGame() {
    score = 0;
    balls = [];
    gameActive = true;
    scoreEl.textContent = score;
    startScreen.classList.add("hidden");
    rewardScreen.classList.add("hidden");
    gameUI.classList.remove("hidden");
    setInterval(() => gameActive && spawnBall(), 1500);
    gameLoop();
  }

  function endGame() {
    gameActive = false;
    gameUI.classList.add("hidden");
    rewardScreen.classList.remove("hidden");
  }

  startBtn.addEventListener("click", startGame);

});
