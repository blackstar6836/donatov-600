// ==========================================
// ALL PRIZES ACCORDION
// ==========================================
function buildAccordion() {
  const acc = document.getElementById("accordion");
  acc.innerHTML = "";
  const item = document.createElement("div");
  item.className = "accordion-item open";
  item.innerHTML = `
    <div class="card">
      <button class="accordion-btn" onclick="this.parentElement.parentElement.classList.toggle('open')">
        <span>🎁 Призы PUBG Mobile</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="accordion-body">
        <div class="accordion-body-inner" id="acc-prizes"></div>
      </div>
    </div>`;
  acc.appendChild(item);

  const inner = document.getElementById("acc-prizes");
  CONFIG.prizes.forEach((p) => {
    inner.innerHTML += `
      <div class="acc-prize-row">
        <span class="ap-icon">${p.icon}</span>
        <span class="ap-name">${p.name}</span>
        <span class="ap-qty">${p.qty}</span>
      </div>`;
  });
}
