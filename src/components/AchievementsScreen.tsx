import { useGameState } from '../hooks/useGameState';
import { achievements } from '../data/teachers';

interface AchievementsScreenProps {
  game: ReturnType<typeof useGameState>;
  onBack: () => void;
}

export default function AchievementsScreen({ game, onBack }: AchievementsScreenProps) {
  const checkAchievement = (achievementId: string) => {
    switch (achievementId) {
      case 'first_click':
        return game.state.totalClicks >= 1;
      case 'clicks_100':
        return game.state.totalClicks >= 100;
      case 'clicks_1000':
        return game.state.totalClicks >= 1000;
      case 'clicks_10000':
        return game.state.totalClicks >= 10000;
      case 'clicks_100000':
        return game.state.totalClicks >= 100000;
      case 'all_teachers':
        return game.state.unlockedTeachers.length >= 15;
      case 'first_prestige':
        return game.state.prestigeLevel >= 1;
      case 'legendary_puzzle':
        return game.state.completedPuzzles.length >= 1;
      case 'clan_member':
        return game.state.clanId !== null;
      case 'mini_boss_defeated':
        return game.state.miniBossDefeated.length >= 1;
      case 'final_boss':
        return game.state.defeatedBosses.includes('nikolai_vasilievich');
      case 'love_found':
        return game.state.loveInterest !== null;
      case 'daily_streak_7':
        return game.state.dailyStreak >= 7;
      case 'speed_master':
        return game.state.speedRecord >= 200;
      default:
        return false;
    }
  };

  const unlockedCount = achievements.filter(a => 
    game.state.unlockedAchievements.includes(a.id) || checkAchievement(a.id)
  ).length;

  const totalReward = achievements
    .filter(a => game.state.unlockedAchievements.includes(a.id) || checkAchievement(a.id))
    .reduce((sum, a) => sum + a.reward, 0);

  return (
    <div className="px-4 py-2">
      <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
        ← Назад
      </button>
      
      <h2 className="text-2xl font-bold mb-4">🏆 Достижения</h2>

      {/* Progress */}
      <div className="bg-gradient-to-r from-yellow-600/50 to-orange-600/50 rounded-xl p-4 mb-6 border border-yellow-400/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg">Прогресс</span>
          <span className="text-2xl font-bold">{unlockedCount}/{achievements.length}</span>
        </div>
        <div className="h-3 bg-black/30 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-white/60">Заработано: {totalReward.toLocaleString()}💰</p>
      </div>

      {/* Achievement List */}
      <div className="space-y-3">
        {achievements.map((achievement) => {
          const isUnlocked = game.state.unlockedAchievements.includes(achievement.id) || checkAchievement(achievement.id);
          
          return (
            <div
              key={achievement.id}
              className={`rounded-xl p-4 border transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-r from-yellow-800/30 to-orange-800/30 border-yellow-400/30'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-3xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.emoji}
                </span>
                <div className="flex-1">
                  <p className={`font-bold ${isUnlocked ? 'text-yellow-400' : ''}`}>
                    {achievement.name}
                  </p>
                  <p className="text-sm text-white/60">{achievement.description}</p>
                </div>
                <div className="text-right">
                  {isUnlocked ? (
                    <span className="text-green-400 text-sm">✓ Открыто</span>
                  ) : (
                    <span className="text-yellow-400 text-sm">+{achievement.reward}💰</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secret Achievements */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white/80 mb-3">🔒 Секретные достижения</h3>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-3xl mb-2">❓</p>
          <p className="text-white/40">Секретные достижения будут открыты по мере игры...</p>
        </div>
      </div>

      {/* Total Stats */}
      <div className="mt-6 bg-white/10 rounded-xl p-4">
        <h3 className="text-lg font-bold mb-3">📊 Общая статистика</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60">Всего кликов</p>
            <p className="text-lg font-bold">{game.state.totalClicks.toLocaleString()}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60">Уровень престижа</p>
            <p className="text-lg font-bold">{game.state.prestigeLevel}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60">Сундуков открыто</p>
            <p className="text-lg font-bold">{game.state.chestsOpened}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60">Дней в игре</p>
            <p className="text-lg font-bold">{game.state.dailyStreak}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
