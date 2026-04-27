export interface GameState {
  clicks: number;
  totalClicks: number;
  loyalty: number;
  prestigeLevel: number;
  prestigeMultiplier: number;
  clickPower: number;
  autoClickPower: number;
  currentTeacherIndex: number;
  unlockedTeachers: string[];
  defeatedBosses: string[];
  unlockedAchievements: string[];
  dailyStreak: number;
  lastLoginDate: string;
  completedTasks: string[];
  chestsOpened: number;
  puzzlePieces: Record<string, number>;
  completedPuzzles: string[];
  clanId: string | null;
  friends: string[];
  loveInterest: string | null;
  miniBossDefeated: string[];
  lastMinuteClicks: number[];
  speedRecord: number;
  totalPlayTime: number;
  lastPlayTime: number;
}

export interface Chest {
  id: string;
  type: 'common' | 'rare' | 'epic' | 'legendary';
  reward: number;
  puzzlePiece?: string;
}

export interface Task {
  id: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  type: 'clicks' | 'loyalty' | 'teachers' | 'time';
}

export interface SocialEvent {
  id: string;
  type: 'friend' | 'love' | 'conflict' | 'celebration';
  description: string;
  options: string[];
  outcome: Record<string, { loyalty: number; friend?: boolean; love?: boolean }>;
}

export interface Clan {
  id: string;
  name: string;
  leader: string;
  members: string[];
  points: number;
  perks: string[];
  icon: string;
}

export interface ClickEffect {
  id: number;
  x: number;
  y: number;
  value: number;
  timestamp: number;
}
