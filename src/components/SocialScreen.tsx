import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';

interface SocialScreenProps {
  game: ReturnType<typeof useGameState>;
  onBack: () => void;
}

const characters = [
  { id: '1', name: 'Аня', emoji: '👧', type: 'friend', personality: 'Весёлая отличница' },
  { id: '2', name: 'Максим', emoji: '👦', type: 'friend', personality: 'Спортсмен' },
  { id: '3', name: 'Лена', emoji: '👩', type: 'love', personality: 'Творческая натура' },
  { id: '4', name: 'Дима', emoji: '🧑', type: 'friend', personality: 'Геймер' },
  { id: '5', name: 'Катя', emoji: '👱‍♀️', type: 'love', personality: 'Мечтательница' },
  { id: '6', name: 'Артём', emoji: '👨', type: 'friend', personality: 'Шутник' },
];

const dialogues = [
  { type: 'friend', text: 'Привет! Пойдём на перемену?', options: ['Конечно!', 'Не могу, занят'] },
  { type: 'friend', text: 'Слышал про новый ивент?', options: ['Да, крутой!', 'Нет, расскажи'] },
  { type: 'love', text: 'Ты такой классный...', options: ['Спасибо! 😊', '...'] },
  { type: 'love', text: 'Хочешь погулять после школы?', options: ['Да! 💕', 'Не могу сегодня'] },
];

const events = [
  {
    id: 'school_dance',
    title: '🎭 Школьный бал',
    description: 'Пригласи кого-нибудь на танец!',
    reward: 500,
  },
  {
    id: 'sport_competition',
    title: '⚽ Спортивные соревнования',
    description: 'Покажи свои навыки!',
    reward: 400,
  },
  {
    id: 'study_group',
    title: '📚 Учебная группа',
    description: 'Учись вместе с друзьями!',
    reward: 300,
  },
];

export default function SocialScreen({ game, onBack }: SocialScreenProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'love' | 'events'>('friends');
  const [selectedChar, setSelectedChar] = useState<typeof characters[0] | null>(null);
  const [currentDialogue, setCurrentDialogue] = useState<typeof dialogues[0] | null>(null);
  const [relationshipLevel, setRelationshipLevel] = useState<Record<string, number>>({});

  const handleTalk = (char: typeof characters[0]) => {
    setSelectedChar(char);
    const charDialogues = dialogues.filter(d => d.type === char.type);
    if (charDialogues.length > 0) {
      setCurrentDialogue(charDialogues[Math.floor(Math.random() * charDialogues.length)]);
    }
  };

  const handleOption = (option: string) => {
    if (selectedChar) {
      // Increase relationship
      setRelationshipLevel(prev => ({
        ...prev,
        [selectedChar.id]: (prev[selectedChar.id] || 0) + 1,
      }));
      
      // Add friend or love
      if (selectedChar.type === 'friend') {
        game.setFriend(selectedChar.id);
      } else if (selectedChar.type === 'love' && (relationshipLevel[selectedChar.id] || 0) >= 2) {
        game.setLoveInterest(selectedChar.id);
        game.addAchievement('love_found');
      }
      
      // Reward
      game.addLoyalty(10);
    }
    setSelectedChar(null);
    setCurrentDialogue(null);
  };

  const handleEvent = (reward: number) => {
    game.addClicks(reward);
  };

  return (
    <div className="px-4 py-2">
      <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
        ← Назад
      </button>
      
      <h2 className="text-2xl font-bold mb-4">💕 Школьная жизнь</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'friends' ? 'bg-blue-500' : 'bg-white/10'
          }`}
        >
          👥 Друзья
        </button>
        <button
          onClick={() => setActiveTab('love')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'love' ? 'bg-pink-500' : 'bg-white/10'
          }`}
        >
          💕 Любовь
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'events' ? 'bg-purple-500' : 'bg-white/10'
          }`}
        >
          🎉 События
        </button>
      </div>

      {/* Dialogue Modal */}
      {selectedChar && currentDialogue && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selectedChar.emoji}</span>
              <div>
                <p className="font-bold">{selectedChar.name}</p>
                <p className="text-sm text-white/60">{selectedChar.personality}</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <p className="text-lg">"{currentDialogue.text}"</p>
            </div>
            <div className="space-y-2">
              {currentDialogue.options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => handleOption(opt)}
                  className="w-full py-3 bg-blue-500 rounded-xl font-bold hover:bg-blue-400 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div>
          <div className="bg-white/10 rounded-xl p-3 mb-4">
            <p className="text-sm text-white/60">Твои друзья</p>
            <p className="text-2xl font-bold">{game.state.friends.length} 👥</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {characters.filter(c => c.type === 'friend').map((char) => (
              <div
                key={char.id}
                className="bg-white/10 rounded-xl p-4 text-center"
              >
                <span className="text-4xl block mb-2">{char.emoji}</span>
                <p className="font-bold">{char.name}</p>
                <p className="text-xs text-white/60 mb-2">{char.personality}</p>
                <p className="text-xs text-blue-400 mb-3">
                  Уровень дружбы: {relationshipLevel[char.id] || 0} 💙
                </p>
                <button
                  onClick={() => handleTalk(char)}
                  className="w-full py-2 bg-blue-500 rounded-lg font-bold text-sm"
                >
                  Поговорить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Love Tab */}
      {activeTab === 'love' && (
        <div>
          {game.state.loveInterest ? (
            <div className="bg-gradient-to-r from-pink-600/50 to-red-600/50 rounded-xl p-4 mb-4 border border-pink-400/30">
              <p className="text-center mb-2">💕 Ваша любовь 💕</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl">
                  {characters.find(c => c.id === game.state.loveInterest)?.emoji}
                </span>
                <div className="text-center">
                  <p className="text-xl font-bold">
                    {characters.find(c => c.id === game.state.loveInterest)?.name}
                  </p>
                  <p className="text-sm text-white/60">Вы вместе!</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 rounded-xl p-4 mb-4 text-center">
              <p className="text-lg">💝 Найди свою любовь!</p>
              <p className="text-sm text-white/60">Общайся с персонажами</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            {characters.filter(c => c.type === 'love').map((char) => (
              <div
                key={char.id}
                className={`bg-white/10 rounded-xl p-4 text-center ${
                  game.state.loveInterest === char.id ? 'border-2 border-pink-400' : ''
                }`}
              >
                <span className="text-4xl block mb-2">{char.emoji}</span>
                <p className="font-bold">{char.name}</p>
                <p className="text-xs text-white/60 mb-2">{char.personality}</p>
                <p className="text-xs text-pink-400 mb-3">
                  ❤️ {relationshipLevel[char.id] || 0}/3
                </p>
                <button
                  onClick={() => handleTalk(char)}
                  className="w-full py-2 bg-pink-500 rounded-lg font-bold text-sm"
                >
                  💕 Флиртовать
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <h3 className="text-lg font-bold text-white/80 mb-3">🎉 Школьные события</h3>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white/10 rounded-xl p-4"
              >
                <p className="font-bold mb-1">{event.title}</p>
                <p className="text-sm text-white/60 mb-3">{event.description}</p>
                <button
                  onClick={() => handleEvent(event.id, event.reward)}
                  className="w-full py-2 bg-purple-500 rounded-lg font-bold"
                >
                  Участвовать (+{event.reward}💰)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
