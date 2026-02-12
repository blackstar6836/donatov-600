// ==========================================
// DAILY CHECK-IN
// ==========================================
const DAY_LABELS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

function renderDaily() {
  const container = document.getElementById("daily-dots");
  container.innerHTML = "";
  for (let i = 0; i < CONFIG.dailyDays; i++) {
    const isChecked = state.dailyChecks.includes(i);
    const isCurrent = i === state.dailyChecks.length && !isChecked;

    const cell = document.createElement("div");
    cell.className = "daily-cell";
    if (isChecked) cell.classList.add("checked");
    if (isCurrent) cell.classList.add("today");

    const label = document.createElement("span");
    label.className = "daily-label";
    label.textContent = DAY_LABELS[i] || (i + 1);

    const icon = document.createElement("span");
    icon.className = "daily-icon";
    if (isChecked) {
      icon.textContent = "✅";
    } else {
      icon.textContent = "🔒";
    }

    cell.appendChild(label);
    cell.appendChild(icon);
    container.appendChild(cell);
  }
  document.getElementById("daily-checked-count").textContent = state.dailyChecks.length;
  document.getElementById("daily-total-count").textContent = CONFIG.dailyDays;

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

  // Каждая отметка = +1 билетик
  state.tickets++;
  document.getElementById("ticket-count").textContent = state.tickets;
  document.getElementById("modal-icon").textContent = "🎟";
  document.getElementById("modal-title").textContent = "Бонус!";
  document.getElementById("modal-text").textContent = "Ежедневная отметка: +1 билетик";
  document.getElementById("modal").classList.add("active");
  updatePlayButton();

  renderDaily();
}
