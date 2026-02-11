// ==========================================
// TASKS
// ==========================================
function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  CONFIG.tasks.forEach((task) => {
    const done = state.completedTasks.includes(task.id);
    const div = document.createElement("div");
    div.className = "task-item";
    div.innerHTML = `
      <div class="task-info">
        <h4>${task.title}</h4>
        <p>${task.desc}</p>
      </div>
      <div class="task-reward">+${task.reward}</div>
      <button class="task-btn${done ? " done" : ""}" onclick="${done ? "" : `completeTask(${task.id},${task.reward})`}" ${done ? "disabled" : ""}>
        ${done ? "✓ Готово" : task.action}
      </button>`;
    list.appendChild(div);
  });
  const completed = state.completedTasks.length;
  document.getElementById("task-progress").textContent =
    `${completed}/${CONFIG.tasks.length}`;
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
