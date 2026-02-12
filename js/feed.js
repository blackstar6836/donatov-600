// ==========================================
// LIVE FEED (simulated)
// ==========================================
const FAKE_NAMES = [
  "Al***x",
  "Ma***a",
  "Dm***y",
  "An***a",
  "Se***y",
  "Ol***g",
  "Ek***a",
  "Vi***r",
  "Na***a",
  "Pa***l",
  "Ir***a",
  "Ko***a",
  "Mi***l",
  "Da***a",
  "Ar***m",
];

function generateFeedItem() {
  const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
  const prize = CONFIG.prizes[Math.floor(Math.random() * CONFIG.prizes.length)];
  return { name, prize: prize.name, icon: prize.icon };
}

function addFeedItem() {
  const item = generateFeedItem();
  state.feedItems.unshift(item);
  if (state.feedItems.length > 50) state.feedItems.pop();
  const list = document.getElementById("feed-list");
  const div = document.createElement("div");
  div.className = "feed-item";
  div.innerHTML = `
    <span class="feed-prize">${item.icon}</span>
    <span class="feed-user">${item.name}</span>
    <span class="feed-text">выиграл(а)</span>
    <span class="feed-prize">${item.prize}</span>`;
  list.prepend(div);
  while (list.children.length > 30) list.removeChild(list.lastChild);
  document.getElementById("feed-total").textContent =
    `Показано: ${Math.min(state.feedItems.length, 30)}`;
}

let feedInterval;
function startFeed() {
  for (let i = 0; i < 8; i++) addFeedItem();
  feedInterval = setInterval(addFeedItem, 900);
}
function stopFeed() {
  clearInterval(feedInterval);
}
