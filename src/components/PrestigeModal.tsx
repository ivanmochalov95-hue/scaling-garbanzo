import { useGameState } from '../hooks/useGameState';

interface PrestigeModalProps {
  game: ReturnType<typeof useGameState>;
  onClose: () => void;
}

export default function PrestigeModal({ game, onClose }: PrestigeModalProps) {
  const prestigeCost = Math.floor(1000 * Math.pow(2, game.state.prestigeLevel));
  const canPrestige = game.state.loyalty >= prestigeCost;
  
  const nextMultiplier = (game.state.prestigeLevel + 1) * 1.5;
  const nextLevel = game.state.prestigeLevel + 1;

  const handlePrestige = () => {
    if (game.prestige()) {
      game.addAchievement('first_prestige');
      onClose();
    }
  };

  const getPrestigeTitle = (level: number) => {
    if (level >= 10) return { title: 'Божество', emoji: '🌟' };
    if (level >= 7) return { title: 'Легенда', emoji: '👑' };
    if (level >= 5) return { title: 'Мастер', emoji: '💎' };
    if (level >= 3) return { title: 'Эксперт', emoji: '🏆' };
    if (level >= 1) return { title: 'Ученик', emoji: '⭐' };
    return { title: 'Новичок', emoji: '🌱' };
  };

  const currentTitle = getPrestigeTitle(game.state.prestigeLevel);
  const nextTitle = getPrestigeTitle(nextLevel);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-sm w-full border border-purple-400/30">
        <div className="text-center mb-6">
          <span className="text-6xl block mb-2">⭐</span>
          <h3 className="text-2xl font-bold">Престиж</h3>
        </div>

        {/* Current Level */}
        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <p className="text-sm text-white/60 mb-1">Текущий уровень</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{currentTitle.emoji}</span>
            <span className="text-xl font-bold">{currentTitle.title}</span>
          </div>
          <p className="text-center text-purple-400 mt-2">
            Уровень {game.state.prestigeLevel} • Множитель x{game.state.prestigeMultiplier.toFixed(1)}
          </p>
        </div>

        {/* Next Level */}
        <div className="bg-gradient-to-r from-yellow-800/30 to-orange-800/30 rounded-xl p-4 mb-4 border border-yellow-400/30">
          <p className="text-sm text-white/60 mb-1">Следующий уровень</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{nextTitle.emoji}</span>
            <span className="text-xl font-bold text-yellow-400">{nextTitle.title}</span>
          </div>
          <p className="text-center text-yellow-400 mt-2">
            Уровень {nextLevel} • Множитель x{nextMultiplier.toFixed(1)}
          </p>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <p className="text-sm text-white/60 mb-2">Требуется для престижа:</p>
          <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
            <span>💝 Лояльность</span>
            <span className={canPrestige ? 'text-green-400' : 'text-red-400'}>
              {Math.floor(game.state.loyalty).toLocaleString()} / {prestigeCost.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-900/30 rounded-xl p-3 mb-4 border border-red-400/30">
          <p className="text-sm text-center text-red-300">
            ⚠️ Престиж сбросит ваши клики, но сохранит достижения и открытых учителей!
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-600 rounded-xl font-bold"
          >
            Отмена
          </button>
          <button
            onClick={handlePrestige}
            disabled={!canPrestige}
            className={`flex-1 py-3 rounded-xl font-bold ${
              canPrestige
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canPrestige ? 'Престиж! ⭐' : 'Недостаточно'}
          </button>
        </div>

        {/* Benefits */}
        <div className="mt-4 text-center text-sm text-white/40">
          <p>Бонусы престижа:</p>
          <p>• +50% ко всем кликам за уровень</p>
          <p>• Увеличение наград за учителей</p>
          <p>• Новые возможности в магазине</p>
        </div>
      </div>
    </div>
  );
}
