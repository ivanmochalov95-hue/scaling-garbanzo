import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { clanPerks } from '../data/teachers';

interface ClanScreenProps {
  game: ReturnType<typeof useGameState>;
  onBack: () => void;
}

const clans = [
  { id: '1', name: 'Отличники', icon: '📚', members: 42, points: 125000, color: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Хулиганы', icon: '😎', members: 38, points: 98000, color: 'from-red-500 to-orange-500' },
  { id: '3', name: 'Спортсмены', icon: '⚽', members: 56, points: 156000, color: 'from-green-500 to-emerald-500' },
  { id: '4', name: 'Творческие', icon: '🎨', members: 31, points: 87000, color: 'from-purple-500 to-pink-500' },
  { id: '5', name: 'Геймеры', icon: '🎮', members: 67, points: 201000, color: 'from-indigo-500 to-violet-500' },
];

export default function ClanScreen({ game, onBack }: ClanScreenProps) {
  
  const [showCreate, setShowCreate] = useState(false);
  const [newClanName, setNewClanName] = useState('');

  const handleJoinClan = () => {
    if (game.state.clanId === null) {
      game.addAchievement('clan_member');
    }
  };

  const handleCreateClan = () => {
    if (newClanName.trim() && game.state.clicks >= 10000) {
      game.upgradeClickPower(10000);
      setShowCreate(false);
      setNewClanName('');
    }
  };

  const myClan = clans.find(c => c.id === game.state.clanId);

  return (
    <div className="px-4 py-2">
      <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
        ← Назад
      </button>
      
      <h2 className="text-2xl font-bold mb-4">👥 Кланы</h2>

      {game.state.clanId ? (
        <div>
          {/* My Clan */}
          <div className={`bg-gradient-to-r ${myClan?.color || 'from-gray-500 to-gray-600'} rounded-xl p-4 mb-6`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{myClan?.icon}</span>
              <div>
                <p className="text-xl font-bold">{myClan?.name}</p>
                <p className="text-sm opacity-80">{myClan?.members} участников</p>
              </div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-sm opacity-80">Очки клана</p>
              <p className="text-2xl font-bold">{myClan?.points.toLocaleString()}</p>
            </div>
          </div>

          {/* Clan Perks */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white/80 mb-3">⚡ Перки клана</h3>
            <div className="space-y-2">
              {clanPerks.map((perk) => (
                <div key={perk.id} className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{perk.name}</p>
                    <p className="text-sm text-white/60">{perk.description}</p>
                  </div>
                  <button
                    disabled
                    className="px-3 py-1 bg-gray-600 text-gray-400 rounded-lg text-sm"
                  >
                    {perk.cost.toLocaleString()}💰
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clan Members */}
          <div>
            <h3 className="text-lg font-bold text-white/80 mb-3">👤 Участники</h3>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm">
                      {i}
                    </div>
                    <span>Игрок_{i}</span>
                  </div>
                  <span className="text-yellow-400">{Math.floor(Math.random() * 10000).toLocaleString()}💰</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Create Clan */}
          <button
            onClick={() => setShowCreate(true)}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 mb-6 font-bold"
          >
            ➕ Создать клан (10,000💰)
          </button>

          {/* Available Clans */}
          <h3 className="text-lg font-bold text-white/80 mb-3">🏰 Доступные кланы</h3>
          <div className="space-y-3">
            {clans.map((clan) => (
              <div
                key={clan.id}
                className={`bg-gradient-to-r ${clan.color} rounded-xl p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{clan.icon}</span>
                    <div>
                      <p className="font-bold text-lg">{clan.name}</p>
                      <p className="text-sm opacity-80">{clan.members} участников</p>
                      <p className="text-xs opacity-60">{clan.points.toLocaleString()} очков</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinClan(clan.id)}
                    className="px-4 py-2 bg-white/20 rounded-lg font-bold hover:bg-white/30 transition-all"
                  >
                    Вступить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Clan Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">➕ Создать клан</h3>
            <input
              type="text"
              value={newClanName}
              onChange={(e) => setNewClanName(e.target.value)}
              placeholder="Название клана"
              className="w-full bg-white/10 rounded-xl p-3 mb-4 text-white placeholder-white/50"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 bg-gray-600 rounded-xl"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateClan}
                disabled={!newClanName.trim() || game.state.clicks < 10000}
                className={`flex-1 py-2 rounded-xl ${
                  newClanName.trim() && game.state.clicks >= 10000
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
