import { useState, useEffect, useCallback } from 'react';
import { GameState, ClickEffect } from '../types/game';
import { teachers } from '../data/teachers';

const STORAGE_KEY = 'school_clicker_save';

const initialState: GameState = {
  clicks: 0,
  totalClicks: 0,
  loyalty: 0,
  prestigeLevel: 0,
  prestigeMultiplier: 1,
  clickPower: 1,
  autoClickPower: 0,
  currentTeacherIndex: 0,
  unlockedTeachers: ['ivan_vladimirovich'],
  defeatedBosses: [],
  unlockedAchievements: [],
  dailyStreak: 0,
  lastLoginDate: '',
  completedTasks: [],
  chestsOpened: 0,
  puzzlePieces: {},
  completedPuzzles: [],
  clanId: null,
  friends: [],
  loveInterest: null,
  miniBossDefeated: [],
  lastMinuteClicks: [],
  speedRecord: 0,
  totalPlayTime: 0,
  lastPlayTime: Date.now(),
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...initialState, ...JSON.parse(saved) };
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [currentTeacherHealth, setCurrentTeacherHealth] = useState(100);
  const [maxTeacherHealth, setMaxTeacherHealth] = useState(100);
  const [showPhrase, setShowPhrase] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [chestChance, setChestChance] = useState(0.05);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Auto-click power
  useEffect(() => {
    if (state.autoClickPower > 0) {
      const interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          clicks: prev.clicks + prev.autoClickPower * prev.prestigeMultiplier,
          totalClicks: prev.totalClicks + prev.autoClickPower * prev.prestigeMultiplier,
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.autoClickPower, state.prestigeMultiplier]);

  // Daily streak check
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastLoginDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      setState((prev) => ({
        ...prev,
        dailyStreak: prev.lastLoginDate === yesterday ? prev.dailyStreak + 1 : 1,
        lastLoginDate: today,
      }));
    }
  }, [state.lastLoginDate]);

  // Track clicks per minute
  useEffect(() => {
    const interval = setInterval(() => {
      const oneMinuteAgo = Date.now() - 60000;
      setState((prev) => {
        const recentClicks = prev.lastMinuteClicks.filter((t) => t > oneMinuteAgo);
        const speed = recentClicks.length;
        return {
          ...prev,
          lastMinuteClicks: recentClicks,
          speedRecord: Math.max(prev.speedRecord, speed),
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentTeacher = useCallback(() => {
    return teachers.find((t) => t.id === state.unlockedTeachers[state.currentTeacherIndex]) || teachers[0];
  }, [state.unlockedTeachers, state.currentTeacherIndex]);

  const addClick = useCallback((x: number, y: number) => {
    const teacher = getCurrentTeacher();
    const clickValue = Math.floor(teacher.baseClickValue * state.clickPower * state.prestigeMultiplier);
    const now = Date.now();

    // Add click effect
    setClickEffects((prev) => [
      ...prev,
      { id: now, x, y, value: clickValue, timestamp: now },
    ]);

    // Remove old effects
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((e) => now - e.timestamp < 1000));
    }, 1000);

    // Random phrase
    if (Math.random() < 0.2) {
      const phrase = teacher.phrases[Math.floor(Math.random() * teacher.phrases.length)];
      setShowPhrase(phrase);
      setTimeout(() => setShowPhrase(null), 2000);
    }

    // Update state
    setState((prev) => ({
      ...prev,
      clicks: prev.clicks + clickValue,
      totalClicks: prev.totalClicks + clickValue,
      lastMinuteClicks: [...prev.lastMinuteClicks, now],
    }));

    // Update health
    setCurrentTeacherHealth((prev) => {
      const newHealth = prev - clickValue;
      if (newHealth <= 0) {
        // Teacher defeated
        const loyaltyGain = Math.floor(teacher.loyaltyReward * state.prestigeMultiplier);
        setState((prev) => ({
          ...prev,
          loyalty: prev.loyalty + loyaltyGain,
          defeatedBosses: teacher.tier.includes('boss') 
            ? [...prev.defeatedBosses, teacher.id] 
            : prev.defeatedBosses,
        }));
        
        // Reset health for next round
        const newMaxHealth = Math.floor(teacher.baseHealth * (1 + state.prestigeLevel * 0.5));
        setMaxTeacherHealth(newMaxHealth);
        return newMaxHealth;
      }
      return newHealth;
    });

    // Random chest
    if (Math.random() < chestChance) {
      return 'chest';
    }

    // Random task
    if (Math.random() < 0.1) {
      return 'task';
    }

    return null;
  }, [getCurrentTeacher, state.clickPower, state.prestigeMultiplier, state.prestigeLevel, chestChance]);

  const unlockTeacher = useCallback((teacherId: string, cost: number) => {
    if (state.clicks >= cost && !state.unlockedTeachers.includes(teacherId)) {
      setState((prev) => ({
        ...prev,
        clicks: prev.clicks - cost,
        unlockedTeachers: [...prev.unlockedTeachers, teacherId],
      }));
      return true;
    }
    return false;
  }, [state.clicks, state.unlockedTeachers]);

  const selectTeacher = useCallback((teacherId: string) => {
    const index = state.unlockedTeachers.indexOf(teacherId);
    if (index !== -1) {
      const teacher = teachers.find((t) => t.id === teacherId);
      if (teacher) {
        const health = Math.floor(teacher.baseHealth * (1 + state.prestigeLevel * 0.5));
        setMaxTeacherHealth(health);
        setCurrentTeacherHealth(health);
      }
      setState((prev) => ({ ...prev, currentTeacherIndex: index }));
    }
  }, [state.unlockedTeachers, state.prestigeLevel]);

  const prestige = useCallback(() => {
    if (state.loyalty >= 1000 * Math.pow(2, state.prestigeLevel)) {
      setState((prev) => ({
        ...prev,
        clicks: 0,
        prestigeLevel: prev.prestigeLevel + 1,
        prestigeMultiplier: prev.prestigeMultiplier * 1.5,
        loyalty: 0,
      }));
      return true;
    }
    return false;
  }, [state.loyalty, state.prestigeLevel]);

  const upgradeClickPower = useCallback((cost: number) => {
    if (state.clicks >= cost) {
      setState((prev) => ({
        ...prev,
        clicks: prev.clicks - cost,
        clickPower: prev.clickPower + 1,
      }));
      return true;
    }
    return false;
  }, [state.clicks]);

  const upgradeAutoClick = useCallback((cost: number) => {
    if (state.clicks >= cost) {
      setState((prev) => ({
        ...prev,
        clicks: prev.clicks - cost,
        autoClickPower: prev.autoClickPower + 1,
      }));
      return true;
    }
    return false;
  }, [state.clicks]);

  const addAchievement = useCallback((achievementId: string) => {
    if (!state.unlockedAchievements.includes(achievementId)) {
      setState((prev) => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, achievementId],
      }));
    }
  }, [state.unlockedAchievements]);

  const addPuzzlePiece = useCallback((puzzleId: string) => {
    setState((prev) => ({
      ...prev,
      puzzlePieces: {
        ...prev.puzzlePieces,
        [puzzleId]: (prev.puzzlePieces[puzzleId] || 0) + 1,
      },
    }));
  }, []);

  const completePuzzle = useCallback((puzzleId: string) => {
    if (!state.completedPuzzles.includes(puzzleId)) {
      setState((prev) => ({
        ...prev,
        completedPuzzles: [...prev.completedPuzzles, puzzleId],
      }));
    }
  }, [state.completedPuzzles]);

  const setChestOpened = useCallback(() => {
    setState((prev) => ({
      ...prev,
      chestsOpened: prev.chestsOpened + 1,
    }));
  }, []);

  const setFriend = useCallback((friendId: string) => {
    if (!state.friends.includes(friendId)) {
      setState((prev) => ({
        ...prev,
        friends: [...prev.friends, friendId],
      }));
    }
  }, [state.friends]);

  const setLoveInterest = useCallback((loveId: string) => {
    setState((prev) => ({
      ...prev,
      loveInterest: loveId,
    }));
  }, []);

  const defeatMiniBoss = useCallback((bossId: string) => {
    if (!state.miniBossDefeated.includes(bossId)) {
      setState((prev) => ({
        ...prev,
        miniBossDefeated: [...prev.miniBossDefeated, bossId],
      }));
    }
  }, [state.miniBossDefeated]);

  const addLoyalty = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      loyalty: prev.loyalty + amount,
    }));
  }, []);

  const addClicks = useCallback((amount: number) => {
    setState((prev) => ({
      ...prev,
      clicks: prev.clicks + amount,
      totalClicks: prev.totalClicks + amount,
    }));
  }, []);

  return {
    state,
    clickEffects,
    currentTeacherHealth,
    maxTeacherHealth,
    showPhrase,
    activeEvent,
    setActiveEvent,
    getCurrentTeacher,
    addClick,
    unlockTeacher,
    selectTeacher,
    prestige,
    upgradeClickPower,
    upgradeAutoClick,
    addAchievement,
    addPuzzlePiece,
    completePuzzle,
    setChestOpened,
    setFriend,
    setLoveInterest,
    defeatMiniBoss,
    addLoyalty,
    addClicks,
    setChestChance,
  };
}
