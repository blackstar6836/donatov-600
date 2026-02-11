// ==========================================
// EVENT MODES
// ==========================================
function applyEventMode() {
  const banner = document.getElementById("event-banner");
  const interactPanel = document.getElementById("interact-panel");
  const tasksSidebar = document.getElementById("tasks-sidebar");
  const feedSection = document.getElementById("feed-section");
  const statsSection = document.getElementById("stats-section");
  const guestCta = document.getElementById("guest-cta");

  // Remove any previous disabled overlays
  interactPanel.classList.remove("disabled-overlay");
  interactPanel.removeAttribute("data-disabled-msg");
  tasksSidebar.classList.remove("disabled-overlay");
  tasksSidebar.removeAttribute("data-disabled-msg");

  if (CONFIG.eventMode === "soon") {
    banner.style.display = "block";
    banner.className = "event-banner soon";
    banner.textContent = "⏳ Ивент скоро начнётся! Следите за обновлениями.";
    feedSection.style.display = "none";
    statsSection.style.display = "none";

    interactPanel.classList.add("disabled-overlay");
    interactPanel.setAttribute("data-disabled-msg", "⏳ Скоро начнётся");
    tasksSidebar.classList.add("disabled-overlay");
    tasksSidebar.setAttribute("data-disabled-msg", "⏳ Скоро начнётся");
    stopFeed();
  } else if (CONFIG.eventMode === "ended") {
    banner.style.display = "block";
    banner.className = "event-banner ended";
    banner.textContent = "🏁 Ивент завершён! Спасибо всем участникам.";
    feedSection.style.display = "none";
    statsSection.style.display = "block";

    interactPanel.classList.add("disabled-overlay");
    interactPanel.setAttribute("data-disabled-msg", "🏁 Ивент завершён");
    tasksSidebar.classList.add("disabled-overlay");
    tasksSidebar.setAttribute("data-disabled-msg", "🏁 Ивент завершён");
    stopFeed();

    document.getElementById("stat-participants").textContent =
      CONFIG.statsParticipants;
    document.getElementById("stat-prizes-given").textContent =
      CONFIG.statsPrizesGiven;
    const statsList = document.getElementById("stats-prize-list");
    statsList.innerHTML = CONFIG.prizes
      .map((p) => `${p.icon} ${p.name} — ${p.qty}`)
      .join("<br>");
  } else {
    // Active
    banner.style.display = "none";
    feedSection.style.display = "block";
    statsSection.style.display = "none";
    startFeed();

    if (!state.isAuth) {
      guestCta.style.display = "flex";
    }
  }
  updatePlayButton();
}
