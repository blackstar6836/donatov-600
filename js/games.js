// ==========================================
// TABS & PLAY (unified)
// ==========================================
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.currentGame = btn.dataset.tab;
    showGame(state.currentGame);
  });
});

function showGame(game) {
  document.getElementById("game-wheel").style.display =
    game === "wheel" ? "flex" : "none";
  document.getElementById("game-roulette").style.display =
    game === "roulette" ? "block" : "none";
  document.getElementById("game-cards").style.display =
    game === "cards" ? "block" : "none";

  if (game === "wheel") drawWheel();
  if (game === "roulette") buildRoulette();
  if (game === "cards") buildCards();
}

function play() {
  if (state.isSpinning || !state.isAuth || state.tickets <= 0) return;
  state.tickets--;
  document.getElementById("ticket-count").textContent = state.tickets;
  updatePlayButton();

  const winIndex = Math.floor(Math.random() * CONFIG.prizes.length);

  if (state.currentGame === "wheel") spinWheel(winIndex);
  else if (state.currentGame === "roulette") spinRoulette(winIndex);
  else if (state.currentGame === "cards") playCards(winIndex);
}

function onWin(prize) {
  // Add to my prizes
  const existing = state.myPrizes.find((p) => p.name === prize.name);
  if (existing) existing.count++;
  else state.myPrizes.push({ name: prize.name, icon: prize.icon, count: 1 });
  renderMyPrizes();

  // Show modal
  document.getElementById("modal-icon").textContent = prize.icon;
  document.getElementById("modal-title").textContent = "Поздравляем!";
  document.getElementById("modal-text").textContent =
    `Вы выиграли: ${prize.name}`;
  document.getElementById("modal").classList.add("active");

  state.isSpinning = false;
  updatePlayButton();
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

// ==========================================
// WHEEL
// ==========================================
let wheelAngle = 0;
const WHEEL_COLORS = [
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
  "#052e16",
];
const WHEEL_COLORS_ALT = [
  "#22c55e",
  "#3b82f6",
  "#22c55e",
  "#3b82f6",
  "#22c55e",
  "#3b82f6",
];

function drawWheel(highlightIndex) {
  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  const cx = 140,
    cy = 140,
    r = 130;
  const segments = CONFIG.prizes.length;
  const arc = (2 * Math.PI) / segments;

  ctx.clearRect(0, 0, 280, 280);

  for (let i = 0; i < segments; i++) {
    const startA = i * arc - Math.PI / 2;
    const endA = startA + arc;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startA, endA);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? "#22c55e" : "#16a34a";
    if (highlightIndex === i) ctx.fillStyle = "#fbbf24";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startA + arc / 2);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = "600 11px Inter, sans-serif";
    const prize = CONFIG.prizes[i];
    ctx.fillText(prize.icon, r * 0.6, -4);
    ctx.font = "600 9px Inter, sans-serif";
    ctx.fillText(prize.name, r * 0.6, 10);
    ctx.restore();
  }
}

function spinWheel(winIndex) {
  if (winIndex === undefined) return;
  state.isSpinning = true;
  const segments = CONFIG.prizes.length;
  const arc = 360 / segments;
  const targetAngle = 360 - (winIndex * arc + arc / 2);
  const totalSpin = 360 * 5 + targetAngle;

  const canvas = document.getElementById("wheelCanvas");
  const ctx = canvas.getContext("2d");
  const cx = 140,
    cy = 140,
    r = 130;
  const segArc = (2 * Math.PI) / segments;
  let startTime = null;
  const duration = 4000;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animate(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOut(progress);
    const currentAngle = easedProgress * totalSpin;

    ctx.clearRect(0, 0, 280, 280);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((currentAngle * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    for (let i = 0; i < segments; i++) {
      const startA = i * segArc - Math.PI / 2;
      const endA = startA + segArc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startA, endA);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#22c55e" : "#16a34a";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startA + segArc / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.font = "600 11px Inter, sans-serif";
      ctx.fillText(CONFIG.prizes[i].icon, r * 0.6, -4);
      ctx.font = "600 9px Inter, sans-serif";
      ctx.fillText(CONFIG.prizes[i].name, r * 0.6, 10);
      ctx.restore();
    }
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(() => onWin(CONFIG.prizes[winIndex]), 400);
    }
  }

  requestAnimationFrame(animate);
}

// ==========================================
// ROULETTE (CS2-like)
// ==========================================
function buildRoulette() {
  const strip = document.getElementById("roulette-strip");
  strip.innerHTML = "";
  strip.style.transform = "translateX(0)";
  for (let i = 0; i < 50; i++) {
    const prize = CONFIG.prizes[i % CONFIG.prizes.length];
    const div = document.createElement("div");
    div.className = "roulette-item";
    div.innerHTML = `<span class="r-icon">${prize.icon}</span><span>${prize.name}</span>`;
    strip.appendChild(div);
  }
}

function spinRoulette(winIndex) {
  state.isSpinning = true;
  const strip = document.getElementById("roulette-strip");
  const itemWidth = 100;
  const winPos = 40;

  strip.innerHTML = "";
  for (let i = 0; i < 50; i++) {
    let prizeIdx;
    if (i === winPos) prizeIdx = winIndex;
    else prizeIdx = Math.floor(Math.random() * CONFIG.prizes.length);
    const prize = CONFIG.prizes[prizeIdx];
    const div = document.createElement("div");
    div.className = "roulette-item";
    if (i === winPos) div.classList.add("winner");
    div.innerHTML = `<span class="r-icon">${prize.icon}</span><span>${prize.name}</span>`;
    strip.appendChild(div);
  }

  const viewport = strip.parentElement;
  const vpCenter = viewport.offsetWidth / 2;
  const targetOffset = winPos * itemWidth + itemWidth / 2 - vpCenter;

  strip.style.transition = "none";
  strip.style.transform = "translateX(0)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      strip.style.transition =
        "transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)";
      strip.style.transform = `translateX(-${targetOffset}px)`;
    });
  });

  setTimeout(() => {
    onWin(CONFIG.prizes[winIndex]);
  }, 4300);
}

// ==========================================
// CARDS
// ==========================================
let cardsState = "showcase";

function buildCards() {
  cardsState = "showcase";
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";
  const count = Math.min(CONFIG.prizes.length, 5);
  for (let i = 0; i < count; i++) {
    const prize = CONFIG.prizes[i];
    const card = document.createElement("div");
    card.className = "flip-card";
    card.dataset.index = i;
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <div class="card-icon">${prize.icon}</div>
          <div class="card-label">${prize.name}</div>
        </div>
        <div class="flip-card-back"></div>
      </div>`;
    grid.appendChild(card);
  }
  document.querySelectorAll(".flip-card").forEach((c, i) => {
    c.style.animation = `cardFloat 2s ease-in-out ${i * 0.15}s infinite alternate`;
  });
}

// Floating animation for showcase
const floatStyle = document.createElement("style");
floatStyle.textContent = `@keyframes cardFloat{0%{transform:translateY(0)}100%{transform:translateY(-6px)}}`;
document.head.appendChild(floatStyle);

function playCards(winIndex) {
  state.isSpinning = true;
  const cards = document.querySelectorAll(".flip-card");
  const count = cards.length;
  const adjustedWin = winIndex % count;

  cards.forEach((c) => {
    c.style.animation = "none";
    c.classList.add("flipped");
  });

  setTimeout(() => {
    cards.forEach((c) => c.classList.add("shuffling"));
    setTimeout(() => {
      cards.forEach((c) => c.classList.remove("shuffling"));
      cardsState = "choosing";

      cards.forEach((c) => {
        c.onclick = () => {
          if (cardsState !== "choosing") return;
          cardsState = "revealed";
          c.classList.add("chosen");

          const front = c.querySelector(".flip-card-front");
          const prize = CONFIG.prizes[winIndex];
          front.querySelector(".card-icon").textContent = prize.icon;
          front.querySelector(".card-label").textContent = prize.name;

          c.classList.remove("flipped");
          c.classList.add("reveal");

          setTimeout(() => {
            onWin(prize);
            setTimeout(() => buildCards(), 500);
          }, 800);
        };
      });
    }, 800);
  }, 600);
}
