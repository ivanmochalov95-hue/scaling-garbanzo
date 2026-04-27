import { teachers } from '../data/teachers';
import { useGameState } from '../hooks/useGameState';

interface TeachersScreenProps {
  game: ReturnType<typeof useGameState>;
  onBack: () => void;
}

export default function TeachersScreen({ game, onBack }: TeachersScreenProps) {
  const unlockedTeachers = teachers.filter(t => game.state.unlockedTeachers.includes(t.id));
  const lockedTeachers = teachers.filter(t => !game.state.unlockedTeachers.includes(t.id));

  const handleUnlock = (teacherId: string, cost: number) => {
    if (game.unlockTeacher(teacherId, cost)) {
      game.addAchievement('all_teachers');
    }
  };

  const handleSelect = (teacherId: string) => {
    game.selectTeacher(teacherId);
  };

  const isSelected = (teacherId: string) => {
    return game.state.unlockedTeachers[game.state.currentTeacherIndex] === teacherId;
  };

  return (
    <div className="px-4 py-2">
      <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
        ← Назад
      </button>
      
      <h2 className="text-2xl font-bold mb-4">👨‍🏫 Учителя</h2>
      
      <div className="bg-white/10 rounded-xl p-3 mb-4">
        <p className="text-sm text-white/60">Открыто учителей</p>
        <p className="text-2xl font-bold">{unlockedTeachers.length} / {teachers.length}</p>
      </div>

      {/* Unlocked Teachers */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white/80 mb-3">✅ Доступные учителя</h3>
        <div className="space-y-3">
          {unlockedTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className={`bg-gradient-to-r ${teacher.bgGradient} rounded-xl p-4 border-2 transition-all ${
                isSelected(teacher.id) ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{teacher.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{teacher.name}</p>
                  <p className="text-sm text-gray-700">{teacher.subject}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-white/50 px-2 py-0.5 rounded">
                      💪 x{teacher.baseClickValue}
                    </span>
                    <span className="text-xs bg-white/50 px-2 py-0.5 rounded">
                      💝 +{teacher.loyaltyReward}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded bg-gradient-to-r ${teacher.color} text-white`}>
                      {teacher.tier === 'common' && '👤'}
                      {teacher.tier === 'rare' && '💎'}
                      {teacher.tier === 'epic' && '💜'}
                      {teacher.tier === 'boss' && '👹'}
                      {teacher.tier === 'final_boss' && '👑'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleSelect(teacher.id)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    isSelected(teacher.id)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white text-gray-900 hover:bg-yellow-100'
                  }`}
                >
                  {isSelected(teacher.id) ? '✓ Выбран' : 'Выбрать'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Locked Teachers */}
      <div>
        <h3 className="text-lg font-bold text-white/80 mb-3">🔒 Заблокированные учителя</h3>
        <div className="space-y-3">
          {lockedTeachers.map((teacher) => {
            const cost = teacher.unlockCost || (teacher.tier === 'rare' ? 1000 : 
                         teacher.tier === 'epic' ? 5000 : 
                         teacher.tier === 'boss' ? 10000 : 
                         teacher.tier === 'final_boss' ? 100000 : 500);
            const canAfford = game.state.clicks >= cost;
            
            return (
              <div
                key={teacher.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl grayscale opacity-50">{teacher.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-white/50">{teacher.name}</p>
                    <p className="text-sm text-white/30">{teacher.subject}</p>
                    <p className="text-xs text-white/40 mt-1">
                      {teacher.tier === 'common' && '👤 Обычный'}
                      {teacher.tier === 'rare' && '💎 Редкий'}
                      {teacher.tier === 'epic' && '💜 Эпический'}
                      {teacher.tier === 'boss' && '👹 Босс'}
                      {teacher.tier === 'final_boss' && '👑 Финальный босс'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnlock(teacher.id, cost)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      canAfford
                        ? 'bg-green-500 text-white hover:bg-green-400'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {cost.toLocaleString()}💰
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defeated Bosses */}
      {game.state.defeatedBosses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-white/80 mb-3">🏆 Побеждённые боссы</h3>
          <div className="flex flex-wrap gap-2">
            {game.state.defeatedBosses.map((bossId) => {
              const boss = teachers.find(t => t.id === bossId);
              return boss ? (
                <div key={bossId} className={`bg-gradient-to-r ${boss.color} px-3 py-2 rounded-lg`}>
                  <span className="mr-2">{boss.emoji}</span>
                  <span className="font-bold text-sm">{boss.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
