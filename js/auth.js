// ==========================================
// AUTH (MOCK)
// ==========================================
function loginTelegram() {
  state.isAuth = true;
  state.user = { name: "Player_42", initial: "P" };
  state.tickets = 5;
  updateAuthUI();
  applyEventMode();
}

function logoutUser() {
  state.isAuth = false;
  state.user = null;
  state.tickets = 0;
  updateAuthUI();
  applyEventMode();
}

function updateAuthUI() {
  const guestH = document.getElementById("guest-header");
  const authH = document.getElementById("auth-header");
  const guestCTA = document.getElementById("guest-cta");

  if (state.isAuth) {
    guestH.style.display = "none";
    authH.style.display = "block";
    guestCTA.style.display = "none";
    document.getElementById("user-avatar").textContent = state.user.initial;
    document.getElementById("user-name").textContent = state.user.name;
    document.getElementById("ticket-count").textContent = state.tickets;
  } else {
    guestH.style.display = "block";
    authH.style.display = "none";
    if (CONFIG.eventMode === "active") {
      guestCTA.style.display = "flex";
    }
  }
  updatePlayButton();
}

function updatePlayButton() {
  const btn = document.getElementById("play-btn");
  const hint = document.getElementById("interact-hint");

  if (!state.isAuth) {
    btn.disabled = true;
    hint.style.display = "inline";
    hint.textContent = "Войдите, чтобы играть";
  } else if (state.tickets <= 0) {
    btn.disabled = true;
    hint.style.display = "inline";
    hint.textContent = "Получи билетики, выполняя задания";
  } else {
    btn.disabled = false;
    hint.style.display = "none";
  }
}
