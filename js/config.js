// ==========================================
// CONFIG
// ==========================================
const CONFIG = {
  gameName: "PUBG Mobile",
  // 'soon' | 'active' | 'ended'
  eventMode: "active",
  // 'wheel' | 'roulette' | 'cards'
  activeGame: "wheel",
  dateStart: "2026-02-10",
  dateEnd: "2026-03-10",
  prizes: [
    { id: 1, name: "UC 60", icon: "🎮", qty: "x1" },
    { id: 2, name: "UC 180", icon: "💎", qty: "x1" },
    { id: 3, name: "UC 600", icon: "💎", qty: "x1" },
    { id: 4, name: "Royale Pass", icon: "🃏", qty: "x1" },
    { id: 5, name: "Скин (рандом)", icon: "🎨", qty: "x1" },
    { id: 6, name: "Лутбокс", icon: "📦", qty: "x1" },
  ],
  tasks: [
    {
      id: 1,
      title: "Подписка на канал",
      desc: "Подпишись на Telegram-канал Donatov.",
      reward: 1,
      action: "Перейти",
      link: "#",
    },
    {
      id: 2,
      title: "Поделиться ивентом",
      desc: "Скопируй ссылку и отправь другу.",
      reward: 1,
      action: "Перейти",
      link: "#",
    },
    {
      id: 3,
      title: "Мини-покупка",
      desc: "Соверши любую покупку на странице PUBG Mobile.",
      reward: 2,
      action: "Перейти",
      link: "#",
    },
    {
      id: 4,
      title: "Заполнить профиль",
      desc: "Добавь несколько фото в профиле donatov.net.",
      reward: 1,
      action: "Перейти",
      link: "#",
    },
  ],
  dailyRequired: 3,
  dailyDays: 7,
  statsParticipants: "1 247",
  statsPrizesGiven: "3 891",
};
