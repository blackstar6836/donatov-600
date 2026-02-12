// ==========================================
// PRIZE DISPLAY (renders from CONFIG.prizes)
// ==========================================
function renderPrizeDisplay() {
  const container = document.getElementById("prize-display");
  container.innerHTML = CONFIG.prizes
    .map(
      (p) =>
        `<div class="prize-item">
          <div class="prize-icon">${p.icon}</div>
          <div class="prize-name">${p.name}</div>
          <div class="prize-qty">${p.qty}</div>
        </div>`,
    )
    .join("");
}
