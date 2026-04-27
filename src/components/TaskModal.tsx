import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';

interface TaskModalProps {
  game: ReturnType<typeof useGameState>;
  onClose: () => void;
}

const tasks = [
  {
    id: 'math_quick',
    type: 'math',
    question: 'Сколько будет 7 × 8?',
    options: ['54', '56', '58', '63'],
    correct: 1,
    reward: 50,
  },
  {
    id: 'russian_spelling',
    type: 'russian',
    question: 'Как правильно пишется?',
    options: ['прекрасный', 'прекрассный', 'прекрасный', 'прикрасный'],
    correct: 0,
    reward: 50,
  },
  {
    id: 'history_year',
    type: 'history',
    question: 'В каком году была основана Москва?',
    options: ['1147', '1247', '1047', '1347'],
    correct: 0,
    reward: 50,
  },
  {
    id: 'english_word',
    type: 'english',
    question: 'Как переводится "beautiful"?',
    options: ['Быстрый', 'Красивый', 'Большой', 'Умный'],
    correct: 1,
    reward: 50,
  },
  {
    id: 'pe_exercise',
    type: 'pe',
    question: 'Сколько отжиманий в нормативе на "5"?',
    options: ['10', '15', '20', '25'],
    correct: 2,
    reward: 50,
  },
  {
    id: 'biology_cell',
    type: 'biology',
    question: 'Какая органелла отвечает за фотосинтез?',
    options: ['Митохондрия', 'Рибосома', 'Хлоропласт', 'Ядро'],
    correct: 2,
    reward: 50,
  },
];

export default function TaskModal({ game, onClose }: TaskModalProps) {
  const [currentTask] = useState(() => tasks[Math.floor(Math.random() * tasks.length)]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    
    setTimeout(() => {
      if (index === currentTask.correct) {
        setResult('correct');
        game.addLoyalty(currentTask.reward);
      } else {
        setResult('wrong');
      }
    }, 500);
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'math': return '📐';
      case 'russian': return '📝';
      case 'history': return '📜';
      case 'english': return '🇬🇧';
      case 'pe': return '🏃';
      case 'biology': return '🧬';
      default: return '📚';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'math': return 'Математика';
      case 'russian': return 'Русский язык';
      case 'history': return 'История';
      case 'english': return 'Английский';
      case 'pe': return 'Физкультура';
      case 'biology': return 'Биология';
      default: return 'Вопрос';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-sm w-full">
        {!result && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{getTypeEmoji(currentTask.type)}</span>
              <span className="text-white/60">{getTypeName(currentTask.type)}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-6">{currentTask.question}</h3>
            
            <div className="space-y-3">
              {currentTask.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-left transition-all ${
                    selectedAnswer === index
                      ? index === currentTask.correct
                        ? 'bg-green-500'
                        : 'bg-red-500'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <p className="text-center mt-4 text-yellow-400">💝 +{currentTask.reward} лояльности</p>
          </>
        )}
        
        {result === 'correct' && (
          <div className="text-center">
            <span className="text-6xl block mb-4">🎉</span>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Правильно!</h3>
            <p className="text-white/60 mb-6">+{currentTask.reward} лояльности</p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-green-500 rounded-xl font-bold"
            >
              Отлично!
            </button>
          </div>
        )}
        
        {result === 'wrong' && (
          <div className="text-center">
            <span className="text-6xl block mb-4">😢</span>
            <h3 className="text-2xl font-bold text-red-400 mb-2">Неправильно</h3>
            <p className="text-white/60 mb-2">Правильный ответ:</p>
            <p className="text-lg font-bold mb-6">{currentTask.options[currentTask.correct]}</p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-600 rounded-xl font-bold"
            >
              Понятно
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
