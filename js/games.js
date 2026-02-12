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
// WHEEL (HTML/CSS)
// ==========================================
let wheelAngle = 0;
const WHEEL_COLORS = ["#22c55e", "#16a34a"];

function drawWheel() {
  const disc = document.getElementById("wheelDisc");
  disc.innerHTML = "";
  disc.classList.remove("spinning");
  disc.style.transform = `rotate(${wheelAngle}deg)`;

  const n = CONFIG.prizes.length;
  const arc = 360 / n;

  // Conic-gradient background
  const stops = CONFIG.prizes.map((_, i) => {
    const c = WHEEL_COLORS[i % 2];
    return `${c} ${i * arc}deg ${(i + 1) * arc}deg`;
  });
  disc.style.background = `conic-gradient(from ${-90 - arc / 2}deg, ${stops.join(", ")})`;

  for (let i = 0; i < n; i++) {
    // Divider line from centre to edge
    const line = document.createElement("div");
    line.className = "wh-line";
    line.style.transform = `rotate(${i * arc}deg)`;
    disc.appendChild(line);

    // Label — rotated along the radius, text reads outward
    const lbl = document.createElement("div");
    lbl.className = "wh-label";
    lbl.style.transform = `rotate(${i * arc + arc / 2}deg)`;
    lbl.innerHTML =
      `<span class="wh-icon">${CONFIG.prizes[i].icon}</span>` +
      `<span class="wh-name">${CONFIG.prizes[i].name}</span>`;
    disc.appendChild(lbl);
  }
}

function spinWheel(winIndex) {
  if (winIndex === undefined) return;
  state.isSpinning = true;

  const disc = document.getElementById("wheelDisc");
  const n = CONFIG.prizes.length;
  const arc = 360 / n;

  // Winning segment centre should stop at the pointer (top)
  const target = -(winIndex * arc + arc / 2);
  const spins = 360 * 5 + (((target % 360) + 360) % 360);
  wheelAngle += spins;

  disc.classList.add("spinning");
  disc.style.transform = `rotate(${wheelAngle}deg)`;

  const onEnd = () => {
    disc.removeEventListener("transitionend", onEnd);
    setTimeout(() => onWin(CONFIG.prizes[winIndex]), 300);
  };
  disc.addEventListener("transitionend", onEnd);
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
      strip.style.transition = "transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)";
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
