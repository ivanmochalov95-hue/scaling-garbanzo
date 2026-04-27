import { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { schoolEvents, miniBosses } from '../data/teachers';

interface EventsScreenProps {
  game: ReturnType<typeof useGameState>;
  onBack: () => void;
}

export default function EventsScreen({ game, onBack }: EventsScreenProps) {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  
  const [miniBossHealth, setMiniBossHealth] = useState(0);
  const [currentMiniBoss, setCurrentMiniBoss] = useState<typeof miniBosses[0] | null>(null);
  const [eventLog, setEventLog] = useState<string[]>([]);

  // Rotate events
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEventIndex((prev) => (prev + 1) % schoolEvents.length);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentEvent = schoolEvents[activeEventIndex];

  const startMiniBoss = () => {
    const boss = miniBosses[Math.floor(Math.random() * miniBosses.length)];
    setCurrentMiniBoss(boss);
    setMiniBossHealth(boss.health);
    setEventLog((prev) => [...prev, `👹 Появился ${boss.name}!`]);
  };

  const attackMiniBoss = () => {
    if (!currentMiniBoss) return;
    
    const damage = game.state.clickPower * 10;
    const newHealth = miniBossHealth - damage;
    
    if (newHealth <= 0) {
      // Boss defeated
      game.addClicks(currentMiniBoss.reward);
      game.defeatMiniBoss(currentMiniBoss.id);
      game.addAchievement('mini_boss_defeated');
      setEventLog((prev) => [...prev, `🎉 ${currentMiniBoss.name} повержен! +${currentMiniBoss.reward}💰`]);
      setCurrentMiniBoss(null);
      setMiniBossHealth(0);
    } else {
      setMiniBossHealth(newHealth);
    }
  };

  const joinEvent = () => {
    game.addClicks(500);
    setEventLog((prev) => [...prev, `✅ Участвовал в ивенте: ${currentEvent.name}`]);
  };

  return (
    <div className="px-4 py-2">
      <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
        ← Назад
      </button>
      
      <h2 className="text-2xl font-bold mb-4">📅 Ивенты</h2>

      {/* Current Event */}
      <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl p-4 mb-6 border border-purple-400/30">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl animate-bounce">{currentEvent.emoji}</span>
          <div>
            <p className="text-lg font-bold">{currentEvent.name}</p>
            <p className="text-sm text-white/60">
              {currentEvent.multiplier && `x${currentEvent.multiplier} к кликам`}
              {currentEvent.loyaltyMultiplier && `x${currentEvent.loyaltyMultiplier} к лояльности`}
              {currentEvent.chestChance && `x${currentEvent.chestChance} шанс сундука`}
              {currentEvent.allMultipliers && `x${currentEvent.allMultipliers} ко всему`}
            </p>
          </div>
        </div>
        <button
          onClick={joinEvent}
          className="w-full py-2 bg-white/20 rounded-lg font-bold hover:bg-white/30 transition-all"
        >
          Участвовать (+500💰)
        </button>
      </div>

      {/* Mini Boss Battle */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white/80 mb-3">👹 Мини-боссы</h3>
        
        {currentMiniBoss ? (
          <div className="bg-gradient-to-r from-red-800/50 to-orange-800/50 rounded-xl p-4 border border-red-400/30">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{currentMiniBoss.emoji}</span>
              <div className="flex-1">
                <p className="font-bold">{currentMiniBoss.name}</p>
                <p className="text-xs text-white/60 italic">
                  "{currentMiniBoss.phrases[Math.floor(Math.random() * currentMiniBoss.phrases.length)]}"
                </p>
              </div>
            </div>
            
            {/* Health Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>❤️ HP</span>
                <span>{Math.max(0, miniBossHealth)} / {currentMiniBoss.health}</span>
              </div>
              <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-200"
                  style={{ width: `${Math.max(0, (miniBossHealth / currentMiniBoss.health) * 100)}%` }}
                />
              </div>
            </div>
            
            <button
              onClick={attackMiniBoss}
              className="w-full py-3 bg-red-500 rounded-lg font-bold hover:bg-red-400 transition-all active:scale-95"
            >
              ⚔️ Атаковать! (-{game.state.clickPower * 10} HP)
            </button>
          </div>
        ) : (
          <button
            onClick={startMiniBoss}
            className="w-full bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-all"
          >
            <span className="text-2xl mr-2">👹</span>
            Вызвать мини-босса
          </button>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white/80 mb-3">📅 Предстоящие ивенты</h3>
        <div className="space-y-2">
          {schoolEvents.map((event, index) => (
            <div
              key={event.id}
              className={`bg-white/10 rounded-xl p-3 flex items-center gap-3 ${
                index === activeEventIndex ? 'border border-purple-400' : ''
              }`}
            >
              <span className="text-2xl">{event.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-sm">{event.name}</p>
                <p className="text-xs text-white/60">
                  {event.duration ? `${event.duration / 60} мин` : 'Постоянный'}
                </p>
              </div>
              {index === activeEventIndex && (
                <span className="text-xs bg-green-500 px-2 py-1 rounded-full">Активен</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white/80 mb-3">📋 Ежедневные задания</h3>
        <div className="space-y-2">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Зайди в игру 3 дня подряд</p>
                <p className="text-xs text-white/60">Прогресс: {game.state.dailyStreak}/3</p>
              </div>
              <span className="text-yellow-400">+300💰</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Сделай 1000 кликов</p>
                <p className="text-xs text-white/60">Прогресс: {Math.min(game.state.totalClicks, 1000)}/1000</p>
              </div>
              <span className="text-yellow-400">+500💰</span>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Открой 5 сундуков</p>
                <p className="text-xs text-white/60">Прогресс: {Math.min(game.state.chestsOpened, 5)}/5</p>
              </div>
              <span className="text-yellow-400">+200💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Log */}
      <div>
        <h3 className="text-lg font-bold text-white/80 mb-3">📜 Журнал событий</h3>
        <div className="bg-white/5 rounded-xl p-3 max-h-40 overflow-y-auto">
          {eventLog.length === 0 ? (
            <p className="text-white/40 text-sm">Пока нет событий...</p>
          ) : (
            eventLog.slice(-10).map((log, index) => (
              <p key={index} className="text-sm text-white/70 mb-1">{log}</p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
