// ==========================================
// DAILY CHECK-IN
// ==========================================
function renderDaily() {
  const dots = document.getElementById("daily-dots");
  dots.innerHTML = "";
  for (let i = 0; i < CONFIG.dailyDays; i++) {
    const dot = document.createElement("div");
    dot.className = "daily-dot";
    if (state.dailyChecks.includes(i)) dot.classList.add("checked");
    if (i === state.dailyChecks.length && !state.dailyChecks.includes(i))
      dot.classList.add("today");
    dot.textContent = i + 1;
    dots.appendChild(dot);
  }
  document.getElementById("streak-count").textContent = state.dailyStreak;

  const btn = document.getElementById("daily-btn");
  const todayIdx = state.dailyChecks.length;
  if (state.dailyChecks.includes(todayIdx) || !state.isAuth) {
    btn.disabled = true;
    btn.textContent = state.isAuth ? "Уже отмечено" : "Войдите";
  } else {
    btn.disabled = false;
    btn.textContent = "Отметиться";
  }
}

function dailyCheckIn() {
  if (!state.isAuth) return;
  const todayIdx = state.dailyChecks.length;
  if (todayIdx >= CONFIG.dailyDays) return;
  state.dailyChecks.push(todayIdx);
  state.dailyStreak++;

  if (state.dailyStreak >= CONFIG.dailyRequired && !state.dailyRewardClaimed) {
    state.dailyRewardClaimed = true;
    state.tickets++;
    document.getElementById("ticket-count").textContent = state.tickets;
    document.getElementById("modal-icon").textContent = "🎟";
    document.getElementById("modal-title").textContent = "Бонус!";
    document.getElementById("modal-text").textContent =
      `${CONFIG.dailyRequired} дня подряд! +1 билетик`;
    document.getElementById("modal").classList.add("active");
    updatePlayButton();
  }

  renderDaily();
}
