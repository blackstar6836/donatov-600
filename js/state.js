// ==========================================
// STATE
// ==========================================
let state = {
  isAuth: false,
  user: null,
  tickets: 0,
  completedTasks: [],
  dailyChecks: [],
  dailyStreak: 0,
  dailyRewardClaimed: false,
  myPrizes: [],
  currentGame: CONFIG.activeGame,
  isSpinning: false,
  feedItems: [],
  prizesVisible: true,
};
