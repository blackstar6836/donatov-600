// ==========================================
// MY PRIZES
// ==========================================
function renderMyPrizes() {
  const list = document.getElementById("my-prizes-list");
  const noP = document.getElementById("no-prizes");
  if (state.myPrizes.length === 0) {
    noP.style.display = "block";
    list.querySelectorAll(".prize-row").forEach((r) => r.remove());
    return;
  }
  noP.style.display = "none";
  list.querySelectorAll(".prize-row").forEach((r) => r.remove());
  state.myPrizes.forEach((p) => {
    const row = document.createElement("div");
    row.className = "prize-row";
    row.innerHTML = `
      <span class="prize-row-icon">${p.icon}</span>
      <div class="prize-row-info">
        <h4>${p.name}</h4>
        <p>×1 за выигрыш</p>
      </div>
      <div class="prize-row-count">выиграно: ${p.count}</div>`;
    list.appendChild(row);
  });
}

function togglePrizesVisibility() {
  const list = document.getElementById("my-prizes-list");
  const btn = document.getElementById("prizes-toggle-btn");
  state.prizesVisible = !state.prizesVisible;
  list.style.display = state.prizesVisible ? "flex" : "none";
  btn.textContent = state.prizesVisible ? "Скрыть" : "Показать";
}
