import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import GameScreen from './components/GameScreen';
import ShopScreen from './components/ShopScreen';
import TeachersScreen from './components/TeachersScreen';
import ClanScreen from './components/ClanScreen';
import EventsScreen from './components/EventsScreen';
import MiniGameScreen from './components/MiniGameScreen';
import RatingScreen from './components/RatingScreen';
import SocialScreen from './components/SocialScreen';
import AchievementsScreen from './components/AchievementsScreen';
import ChestModal from './components/ChestModal';
import TaskModal from './components/TaskModal';
import PrestigeModal from './components/PrestigeModal';

export type Screen = 'game' | 'shop' | 'teachers' | 'clan' | 'events' | 'minigames' | 'rating' | 'social' | 'achievements';

export default function App() {
  const game = useGameState();
  const [currentScreen, setCurrentScreen] = useState<Screen>('game');
  const [showChest, setShowChest] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showPrestige, setShowPrestige] = useState(false);

  const handleBack = () => setCurrentScreen('game');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'shop':
        return <ShopScreen game={game} onBack={handleBack} />;
      case 'teachers':
        return <TeachersScreen game={game} onBack={handleBack} />;
      case 'clan':
        return <ClanScreen game={game} onBack={handleBack} />;
      case 'events':
        return <EventsScreen game={game} onBack={handleBack} />;
      case 'minigames':
        return <MiniGameScreen game={game} onBack={handleBack} />;
      case 'rating':
        return <RatingScreen game={game} onBack={handleBack} />;
      case 'social':
        return <SocialScreen game={game} onBack={handleBack} />;
      case 'achievements':
        return <AchievementsScreen game={game} onBack={handleBack} />;
      default:
        return (
          <GameScreen
            game={game}
            onChest={() => setShowChest(true)}
            onTask={() => setShowTask(true)}
            onPrestige={() => setShowPrestige(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            <div>
              <h1 className="text-sm font-bold leading-tight">Школьные Баттлы</h1>
              <p className="text-xs text-white/60">МОБУ СОШ им. Алымова А.М</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-yellow-400">💰 {Math.floor(game.state.clicks).toLocaleString()}</p>
              <p className="text-xs text-pink-400">💝 {Math.floor(game.state.loyalty).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-purple-400">⭐ Престиж: {game.state.prestigeLevel}</p>
              <p className="text-xs text-green-400">🔥 Серия: {game.state.dailyStreak} дн.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20 min-h-screen">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      {currentScreen === 'game' && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-t border-white/10">
          <div className="flex justify-around py-2">
            <NavButton icon="🎮" label="Игра" active onClick={() => setCurrentScreen('game')} />
            <NavButton icon="🛒" label="Магазин" onClick={() => setCurrentScreen('shop')} />
            <NavButton icon="👨‍🏫" label="Учителя" onClick={() => setCurrentScreen('teachers')} />
            <NavButton icon="👥" label="Клан" onClick={() => setCurrentScreen('clan')} />
            <NavButton icon="📊" label="Меню" onClick={() => setCurrentScreen('rating')} />
          </div>
          <div className="flex justify-around py-2 border-t border-white/10">
            <NavButton icon="📅" label="Ивенты" onClick={() => setCurrentScreen('events')} />
            <NavButton icon="🎯" label="Мини-игры" onClick={() => setCurrentScreen('minigames')} />
            <NavButton icon="💕" label="Жизнь" onClick={() => setCurrentScreen('social')} />
            <NavButton icon="🏆" label="Достижения" onClick={() => setCurrentScreen('achievements')} />
          </div>
        </nav>
      )}

      {/* Modals */}
      {showChest && (
        <ChestModal game={game} onClose={() => setShowChest(false)} />
      )}
      {showTask && (
        <TaskModal game={game} onClose={() => setShowTask(false)} />
      )}
      {showPrestige && (
        <PrestigeModal game={game} onClose={() => setShowPrestige(false)} />
      )}
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
        active ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}
