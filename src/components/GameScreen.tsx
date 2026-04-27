import { useRef, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';

interface GameScreenProps {
  game: ReturnType<typeof useGameState>;
  onChest: () => void;
  onTask: () => void;
  onPrestige: () => void;
}

export default function GameScreen({ game, onChest, onTask, onPrestige }: GameScreenProps) {
  const teacher = game.getCurrentTeacher();
  const healthPercent = (game.currentTeacherHealth / game.maxTeacherHealth) * 100;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let x: number, y: number;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    const result = game.addClick(x, y);
    if (result === 'chest') {
      onChest();
    } else if (result === 'task') {
      onTask();
    }
  }, [game, onChest, onTask]);

  const prestigeCost = Math.floor(1000 * Math.pow(2, game.state.prestigeLevel));
  const canPrestige = game.state.loyalty >= prestigeCost;

  const clicksPerMinute = game.state.lastMinuteClicks.length;

  return (
    <div className="px-4 py-2">
      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-2xl">👆</p>
          <p className="text-lg font-bold text-yellow-400">{Math.floor(game.state.clicks).toLocaleString()}</p>
          <p className="text-xs text-white/60">Клики</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-2xl">💪</p>
          <p className="text-lg font-bold text-cyan-400">x{game.state.clickPower}</p>
          <p className="text-xs text-white/60">Сила</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <p className="text-2xl">⚡</p>
          <p className="text-lg font-bold text-green-400">{clicksPerMinute}/мин</p>
          <p className="text-xs text-white/60">Скорость</p>
        </div>
      </div>

      {/* Teacher Display */}
      <div
        ref={containerRef}
        onClick={handleClick}
        onTouchStart={handleClick}
        className="relative bg-gradient-to-br from-indigo-800/50 to-purple-800/50 rounded-3xl p-6 mb-4 cursor-pointer select-none touch-none overflow-hidden border-2 border-white/20 shadow-2xl"
        style={{ minHeight: '320px' }}
      >
        {/* Click Effects */}
        {game.clickEffects.map((effect) => (
          <div
            key={effect.id}
            className="absolute pointer-events-none animate-float-up text-2xl font-bold text-yellow-400"
            style={{
              left: effect.x,
              top: effect.y,
              textShadow: '0 0 10px rgba(250, 204, 21, 0.8)',
            }}
          >
            +{effect.value}
          </div>
        ))}

        {/* Phrase Bubble */}
        {game.showPhrase && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 rounded-2xl px-4 py-2 text-sm font-medium shadow-lg animate-bounce max-w-[200px] text-center z-10">
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
            "{game.showPhrase}"
          </div>
        )}

        {/* Teacher Emoji */}
        <div className="flex flex-col items-center justify-center h-full">
          <div className={`text-8xl mb-4 animate-pulse ${teacher.tier === 'final_boss' ? 'animate-spin-slow' : ''}`}>
            {teacher.emoji}
          </div>
          <h2 className="text-xl font-bold text-center mb-1">{teacher.name}</h2>
          <p className="text-sm text-white/70 mb-2">{teacher.subject}</p>
          
          {/* Tier Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${teacher.color}`}>
            {teacher.tier === 'common' && '👤 Обычный'}
            {teacher.tier === 'rare' && '💎 Редкий'}
            {teacher.tier === 'epic' && '💜 Эпический'}
            {teacher.tier === 'boss' && '👹 Босс'}
            {teacher.tier === 'final_boss' && '👑 ФИНАЛЬНЫЙ БОСС'}
          </div>

          {/* Health Bar */}
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs mb-1">
              <span>❤️ HP</span>
              <span>{Math.floor(game.currentTeacherHealth)} / {game.maxTeacherHealth}</span>
            </div>
            <div className="h-4 bg-black/30 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 rounded-full ${
                  healthPercent > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                  healthPercent > 25 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                  'bg-gradient-to-r from-red-500 to-pink-400'
                }`}
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>

          {/* Click Power Info */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-white/60">Урон за клик:</span>
            <span className="text-yellow-400 font-bold">
              {Math.floor(teacher.baseClickValue * game.state.clickPower * game.state.prestigeMultiplier)}
            </span>
            {game.state.prestigeMultiplier > 1 && (
              <span className="text-purple-400">(x{game.state.prestigeMultiplier.toFixed(1)})</span>
            )}
          </div>
        </div>
      </div>

      {/* Prestige Button */}
      <button
        onClick={onPrestige}
        disabled={!canPrestige}
        className={`w-full py-3 rounded-xl font-bold text-lg mb-4 transition-all ${
          canPrestige
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 animate-pulse'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        ⭐ Престиж (нужно {prestigeCost.toLocaleString()} 💝)
        {canPrestige && ' - ДОСТУПНО!'}
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/60">Всего кликов</p>
          <p className="text-lg font-bold">{game.state.totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/60">Рекорд скорости</p>
          <p className="text-lg font-bold">{game.state.speedRecord} в мин</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/60">Учителей открыто</p>
          <p className="text-lg font-bold">{game.state.unlockedTeachers.length}/15</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/60">Сундуков открыто</p>
          <p className="text-lg font-bold">{game.state.chestsOpened}</p>
        </div>
      </div>

      {/* Auto Click Indicator */}
      {game.state.autoClickPower > 0 && (
        <div className="mt-4 bg-green-600/30 border border-green-400/30 rounded-xl p-3 text-center">
          <p className="text-green-400">
            ⚡ Автокликер активен: +{game.state.autoClickPower} в секунду
          </p>
        </div>
      )}
    </div>
  );
}
