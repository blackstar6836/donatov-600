// ==========================================
// INIT
// ==========================================
function init() {
  drawWheel();
  buildRoulette();
  buildCards();
  renderTasks();
  renderDaily();
  renderMyPrizes();
  buildAccordion();
  showGame(state.currentGame);
  updateAuthUI();
  applyEventMode();

  // Set active tab
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === CONFIG.activeGame);
  });
}

init();
