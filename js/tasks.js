// ==========================================
// TASKS
// ==========================================
function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  CONFIG.tasks.forEach((task) => {
    const done = state.completedTasks.includes(task.id);
    const visited = state.visitedTasks.includes(task.id);
    const div = document.createElement("div");
    div.className = "task-item";

    let btnClass = "task-btn";
    let btnLabel = task.action;
    let btnAction = `visitTask(${task.id})`;
    let btnDisabled = false;

    if (done) {
      btnClass = "task-btn done";
      btnLabel = "✓ Готово";
      btnAction = "";
      btnDisabled = true;
    } else if (visited) {
      btnClass = "task-btn verify";
      btnLabel = "Проверить";
      btnAction = `completeTask(${task.id},${task.reward})`;
    }

    div.innerHTML = `
      <div class="task-info">
        <h4>${task.title}</h4>
        <p>${task.desc}</p>
      </div>
      <div class="task-reward">+${task.reward}</div>
      <button class="${btnClass}" onclick="${btnAction}" ${btnDisabled ? "disabled" : ""}>
        ${btnLabel}
      </button>`;
    list.appendChild(div);
  });
  const completed = state.completedTasks.length;
  document.getElementById("task-progress").textContent =
    `${completed}/${CONFIG.tasks.length}`;
}

function visitTask(id) {
  if (!state.isAuth) {
    loginTelegram();
    return;
  }
  if (state.visitedTasks.includes(id)) return;
  const task = CONFIG.tasks.find((t) => t.id === id);
  if (task && task.link) window.open(task.link, "_blank");
  state.visitedTasks.push(id);
  renderTasks();
}

function completeTask(id, reward) {
  if (!state.isAuth) {
    loginTelegram();
    return;
  }
  if (state.completedTasks.includes(id)) return;
  state.completedTasks.push(id);
  state.tickets += reward;
  document.getElementById("ticket-count").textContent = state.tickets;
  renderTasks();
  updatePlayButton();
}
