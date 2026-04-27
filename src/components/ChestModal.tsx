import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { teachers } from '../data/teachers';

interface ChestModalProps {
  game: ReturnType<typeof useGameState>;
  onClose: () => void;
}

const chestTypes = [
  { type: 'common', name: 'Обычный', color: 'from-gray-500 to-gray-600', chance: 0.6, rewards: [50, 100, 150] },
  { type: 'rare', name: 'Редкий', color: 'from-blue-500 to-cyan-500', chance: 0.25, rewards: [200, 300, 400] },
  { type: 'epic', name: 'Эпический', color: 'from-purple-500 to-pink-500', chance: 0.12, rewards: [500, 750, 1000] },
  { type: 'legendary', name: 'Легендарный', color: 'from-yellow-500 to-orange-500', chance: 0.03, rewards: [2000, 3000, 5000] },
];

export default function ChestModal({ game, onClose }: ChestModalProps) {
  const [phase, setPhase] = useState<'chest' | 'opening' | 'result'>('chest');
  const [chestType, setChestType] = useState<typeof chestTypes[0]>(chestTypes[0]);
  const [reward, setReward] = useState(0);
  const [puzzlePiece, setPuzzlePiece] = useState<string | null>(null);

  const handleOpen = () => {
    setPhase('opening');
    
    // Determine chest type
    const rand = Math.random();
    let cumulative = 0;
    let selectedType = chestTypes[0];
    
    for (const type of chestTypes) {
      cumulative += type.chance;
      if (rand < cumulative) {
        selectedType = type;
        break;
      }
    }
    
    setChestType(selectedType);
    
    // Simulate opening
    setTimeout(() => {
      // Calculate reward
      const rewardIndex = Math.floor(Math.random() * selectedType.rewards.length);
      const finalReward = selectedType.rewards[rewardIndex] * game.state.prestigeMultiplier;
      setReward(Math.floor(finalReward));
      
      // Chance for puzzle piece
      if (Math.random() < 0.3) {
        const unlockedTeachers = teachers.filter(t => game.state.unlockedTeachers.includes(t.id));
        if (unlockedTeachers.length > 0) {
          const randomTeacher = unlockedTeachers[Math.floor(Math.random() * unlockedTeachers.length)];
          setPuzzlePiece(randomTeacher.id);
          game.addPuzzlePiece(randomTeacher.id);
        }
      }
      
      game.addClicks(Math.floor(finalReward));
      game.setChestOpened();
      setPhase('result');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-sm w-full text-center">
        {phase === 'chest' && (
          <>
            <h3 className="text-2xl font-bold mb-4">📦 Найден сундук!</h3>
            <div className="text-8xl mb-6 animate-bounce">📦</div>
            <p className="text-white/60 mb-6">Открыть сундук?</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-600 rounded-xl font-bold"
              >
                Не сейчас
              </button>
              <button
                onClick={handleOpen}
                className="flex-1 py-3 bg-yellow-500 rounded-xl font-bold"
              >
                Открыть!
              </button>
            </div>
          </>
        )}
        
        {phase === 'opening' && (
          <>
            <h3 className="text-2xl font-bold mb-4">Открываем...</h3>
            <div className="text-8xl mb-6 animate-spin">📦</div>
            <div className="flex justify-center gap-1">
              <span className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </>
        )}
        
        {phase === 'result' && (
          <>
            <h3 className="text-2xl font-bold mb-4">
              {chestType.type === 'legendary' ? '🌟ЛЕГЕНДАРНЫЙ!🌟' : 
               chestType.type === 'epic' ? '💜 Эпический!' :
               chestType.type === 'rare' ? '💎 Редкий!' : '📦 Обычный'}
            </h3>
            <div className={`text-8xl mb-4 bg-gradient-to-r ${chestType.color} bg-clip-text`}>
              🎁
            </div>
            <p className="text-4xl font-bold text-yellow-400 mb-4">+{reward.toLocaleString()}💰</p>
            
            {puzzlePiece && (
              <div className="bg-purple-800/50 rounded-xl p-3 mb-4 border border-purple-400/30">
                <p className="text-purple-400 mb-2">🧩 Найден кусочек пазла!</p>
                <p className="font-bold">
                  {teachers.find(t => t.id === puzzlePiece)?.emoji} {teachers.find(t => t.id === puzzlePiece)?.name}
                </p>
                <p className="text-sm text-white/60">
                  Собрано: {game.state.puzzlePieces[puzzlePiece] || 1}/5
                </p>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="w-full py-3 bg-green-500 rounded-xl font-bold"
            >
              Забрать!
            </button>
          </>
        )}
      </div>
    </div>
  );
}
