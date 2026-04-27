import { useGameState } from '../hooks/useGameState';

interface ShopScreenProps {
  game: ReturnType<typeof useGameState>;
  onBack: () => void;
}

export default function ShopScreen({ game, onBack }: ShopScreenProps) {
  const handleAutoClick = () => {
    const cost = 1000 * Math.pow(2, game.state.autoClickPower);
    if (game.state.clicks >= cost) {
      game.upgradeAutoClick(cost);
    }
  };

  return (
    <div className="px-4 py-2">
      <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
        ← Назад
      </button>
      
      <h2 className="text-2xl font-bold mb-4">🛒 Магазин</h2>
      
      <div className="bg-white/10 rounded-xl p-3 mb-4">
        <p className="text-lg">💰 Баланс: <span className="text-yellow-400 font-bold">{Math.floor(game.state.clicks).toLocaleString()}</span></p>
      </div>

      {/* Click Power Upgrades */}
      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-bold text-white/80">⚔️ Улучшения</h3>
        
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold">👆 Сила клика</p>
              <p className="text-sm text-white/60">Текущая: x{game.state.clickPower}</p>
            </div>
            <button
              onClick={() => game.upgradeClickPower(100 * game.state.clickPower)}
              disabled={game.state.clicks < 100 * game.state.clickPower}
              className={`px-4 py-2 rounded-lg font-bold ${
                game.state.clicks >= 100 * game.state.clickPower
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-gray-400'
              }`}
            >
              +1 ( {(100 * game.state.clickPower).toLocaleString()}💰 )
            </button>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold">🤖 Автокликер</p>
              <p className="text-sm text-white/60">Текущий: {game.state.autoClickPower}/сек</p>
            </div>
            <button
              onClick={handleAutoClick}
              disabled={game.state.clicks < 1000 * Math.pow(2, game.state.autoClickPower)}
              className={`px-4 py-2 rounded-lg font-bold ${
                game.state.clicks >= 1000 * Math.pow(2, game.state.autoClickPower)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-600 text-gray-400'
              }`}
            >
              +1 ( {Math.floor(1000 * Math.pow(2, game.state.autoClickPower)).toLocaleString()}💰 )
            </button>
          </div>
        </div>
      </div>

      {/* Special Items */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white/80">✨ Особые предметы</h3>
        
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-xl p-4 border border-purple-400/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">📦 Увеличитель сундуков</p>
              <p className="text-sm text-white/60">+5% шанс выпадения сундука</p>
            </div>
            <button
              onClick={() => {
                if (game.state.clicks >= 5000) {
                  game.upgradeClickPower(5000);
                  game.setChestChance(0.1);
                }
              }}
              disabled={game.state.clicks < 5000}
              className={`px-4 py-2 rounded-lg font-bold ${
                game.state.clicks >= 5000
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-600 text-gray-400'
              }`}
            >
              5,000💰
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-800/50 to-orange-800/50 rounded-xl p-4 border border-yellow-400/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">⚡ Мега-клик</p>
              <p className="text-sm text-white/60">x10 урон на 10 секунд</p>
            </div>
            <button
              disabled={game.state.clicks < 10000}
              className={`px-4 py-2 rounded-lg font-bold ${
                game.state.clicks >= 10000
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-600 text-gray-400'
              }`}
            >
              10,000💰
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-800/50 to-emerald-800/50 rounded-xl p-4 border border-green-400/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">💝 Лояльность x2</p>
              <p className="text-sm text-white/60">Мгновенная лояльность</p>
            </div>
            <button
              onClick={() => {
                if (game.state.clicks >= 3000) {
                  game.upgradeClickPower(3000);
                  game.addLoyalty(100);
                }
              }}
              disabled={game.state.clicks < 3000}
              className={`px-4 py-2 rounded-lg font-bold ${
                game.state.clicks >= 3000
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-gray-400'
              }`}
            >
              3,000💰
            </button>
          </div>
        </div>
      </div>

      {/* Daily Bonus */}
      {game.state.dailyStreak > 0 && (
        <div className="mt-6 bg-gradient-to-r from-blue-800/50 to-cyan-800/50 rounded-xl p-4 border border-blue-400/30">
          <p className="font-bold mb-2">🎁 Ежедневный бонус</p>
          <p className="text-sm text-white/60 mb-3">Серия: {game.state.dailyStreak} дней</p>
          <button
            onClick={() => game.addClicks(100 * game.state.dailyStreak)}
            className="w-full py-2 bg-blue-500 rounded-lg font-bold"
          >
            Забрать {100 * game.state.dailyStreak}💰
          </button>
        </div>
      )}
    </div>
  );
}
