import { useGameState } from '../hooks/useGameState';

interface RatingScreenProps {
  game: ReturnType<typeof useGameState>;
  onBack: () => void;
}

const leaderboard = [
  { rank: 1, name: 'СуперКликер2000', clicks: 1250000, emoji: '👑' },
  { rank: 2, name: 'ШкольныйГерой', clicks: 980000, emoji: '🥈' },
  { rank: 3, name: 'ОтличникПро', clicks: 756000, emoji: '🥉' },
  { rank: 4, name: 'МастерКликов', clicks: 542000, emoji: '4' },
  { rank: 5, name: 'Нажиматель', clicks: 423000, emoji: '5' },
  { rank: 6, name: 'КликМастер', clicks: 398000, emoji: '6' },
  { rank: 7, name: 'БыстрыеРуки', clicks: 356000, emoji: '7' },
  { rank: 8, name: 'Школьник2024', clicks: 234000, emoji: '8' },
  { rank: 9, name: 'Нубик', clicks: 156000, emoji: '9' },
  { rank: 10, name: 'Начинающий', clicks: 89000, emoji: '10' },
];

export default function RatingScreen({ game, onBack }: RatingScreenProps) {
  const playerRank = leaderboard.findIndex(
    (p) => game.state.totalClicks > p.clicks
  ) + 1 || 11;

  const getSpeedRank = () => {
    if (game.state.speedRecord >= 200) return { rank: 'Легенда', color: 'text-yellow-400' };
    if (game.state.speedRecord >= 150) return { rank: 'Мастер', color: 'text-purple-400' };
    if (game.state.speedRecord >= 100) return { rank: 'Эксперт', color: 'text-blue-400' };
    if (game.state.speedRecord >= 50) return { rank: 'Ученик', color: 'text-green-400' };
    return { rank: 'Новичок', color: 'text-gray-400' };
  };

  const getPrestigeRank = () => {
    if (game.state.prestigeLevel >= 10) return { rank: 'Божество', emoji: '🌟' };
    if (game.state.prestigeLevel >= 5) return { rank: 'Легенда', emoji: '👑' };
    if (game.state.prestigeLevel >= 3) return { rank: 'Мастер', emoji: '💎' };
    if (game.state.prestigeLevel >= 1) return { rank: 'Ученик', emoji: '⭐' };
    return { rank: 'Начинающий', emoji: '🌱' };
  };

  const speedRank = getSpeedRank();
  const prestigeRank = getPrestigeRank();

  return (
    <div className="px-4 py-2">
      <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
        ← Назад
      </button>
      
      <h2 className="text-2xl font-bold mb-4">📊 Рейтинг</h2>

      {/* Player Stats */}
      <div className="bg-gradient-to-r from-indigo-600/50 to-purple-600/50 rounded-xl p-4 mb-6 border border-indigo-400/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <p className="font-bold text-lg">Твой профиль</p>
            <p className="text-sm text-white/60">Ранг: #{playerRank}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60">Всего кликов</p>
            <p className="text-lg font-bold">{game.state.totalClicks.toLocaleString()}</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60">Престиж</p>
            <p className={`text-lg font-bold ${prestigeRank.emoji !== '🌱' ? 'text-yellow-400' : ''}`}>
              {prestigeRank.emoji} {game.state.prestigeLevel}
            </p>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-xs text-white/60">Скорость</p>
            <p className={`text-lg font-bold ${speedRank.color}`}>{speedRank.rank}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white/80 mb-3">🏆 Таблица лидеров</h3>
        <div className="space-y-2">
          {leaderboard.map((player, index) => (
            <div
              key={player.rank}
              className={`bg-white/10 rounded-xl p-3 flex items-center gap-3 ${
                index < 3 ? 'border border-yellow-400/30' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-yellow-500' :
                index === 1 ? 'bg-gray-400' :
                index === 2 ? 'bg-orange-600' :
                'bg-white/20'
              }`}>
                {player.emoji}
              </div>
              <div className="flex-1">
                <p className="font-bold">{player.name}</p>
                <p className="text-xs text-white/60">{player.clicks.toLocaleString()} кликов</p>
              </div>
              <span className="text-yellow-400 font-bold">#{player.rank}</span>
            </div>
          ))}
          
          {/* Player position */}
          <div className="bg-gradient-to-r from-blue-600/50 to-cyan-600/50 rounded-xl p-3 flex items-center gap-3 border border-blue-400/30">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
              👤
            </div>
            <div className="flex-1">
              <p className="font-bold">Ты</p>
              <p className="text-xs text-white/60">{game.state.totalClicks.toLocaleString()} кликов</p>
            </div>
            <span className="text-blue-400 font-bold">#{playerRank}</span>
          </div>
        </div>
      </div>

      {/* Speed Rankings */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white/80 mb-3">⚡ Рекорды скорости</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-3xl mb-2">🚀</p>
            <p className="text-sm text-white/60">Твой рекорд</p>
            <p className="text-xl font-bold text-yellow-400">{game.state.speedRecord}</p>
            <p className="text-xs text-white/40">кликов в минуту</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-3xl mb-2">🏆</p>
            <p className="text-sm text-white/60">Лучший результат</p>
            <p className="text-xl font-bold text-green-400">256</p>
            <p className="text-xs text-white/40">кликов в минуту</p>
          </div>
        </div>
      </div>

      {/* Collection Progress */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white/80 mb-3">📦 Коллекции</h3>
        <div className="space-y-2">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex justify-between mb-2">
              <span>👨‍🏫 Учителя</span>
              <span>{game.state.unlockedTeachers.length}/15</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                style={{ width: `${(game.state.unlockedTeachers.length / 15) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex justify-between mb-2">
              <span>🏆 Достижения</span>
              <span>{game.state.unlockedAchievements.length}/14</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-400"
                style={{ width: `${(game.state.unlockedAchievements.length / 14) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex justify-between mb-2">
              <span>🧩 Пазлы</span>
              <span>{game.state.completedPuzzles.length}/10</span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-400"
                style={{ width: `${(game.state.completedPuzzles.length / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* School Info */}
      <div className="bg-gradient-to-r from-blue-800/30 to-indigo-800/30 rounded-xl p-4 text-center border border-blue-400/20">
        <p className="text-lg font-bold mb-1">🏫 МОБУ СОШ им. Алымова А.М</p>
        <p className="text-sm text-white/60">Школьные Баттлы v1.0</p>
      </div>
    </div>
  );
}
