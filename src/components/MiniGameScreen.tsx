import { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { miniGames } from '../data/teachers';

interface MiniGameScreenProps {
  game: ReturnType<typeof useGameState>;
  onBack: () => void;
}

export default function MiniGameScreen({ game, onBack }: MiniGameScreenProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  
  // Math game state
  const [mathProblem, setMathProblem] = useState({ a: 0, b: 0, op: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  
  // Dictation game state
  const [dictationWord, setDictationWord] = useState('');
  const [hasError, setHasError] = useState(false);
  const [correctWords] = useState(['природа', 'прекрасный', 'великолепный', 'приветливый', 'восхитительный']);
  const [errorWords] = useState(['пречудесный', 'великолепный', 'преветливый', 'восхетительный', 'прекрассный']);
  
  // Speed click state
  const [speedClicks, setSpeedClicks] = useState(0);
  
  // Memory game state
  const [memorySequence, setMemorySequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [memoryColors] = useState(['🔴', '🟢', '🔵', '🟡']);

  useEffect(() => {
    if (activeGame && timeLeft > 0 && !gameResult) {
      const timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && activeGame && !gameResult) {
      endGame(false);
    }
  }, [activeGame, timeLeft, gameResult]);

  const startGame = (gameId: string) => {
    setActiveGame(gameId);
    setScore(0);
    setTimeLeft(30);
    setGameResult(null);
    setUserAnswer('');
    setSpeedClicks(0);
    setUserSequence([]);
    
    if (gameId === 'math_example') {
      generateMathProblem();
    } else if (gameId === 'dictation') {
      generateDictation();
    } else if (gameId === 'memory_game') {
      generateMemorySequence();
    }
  };

  const endGame = (won: boolean) => {
    setGameResult(won ? 'win' : 'lose');
    if (won) {
      const reward = miniGames.find(g => g.id === activeGame)?.reward || 50;
      game.addClicks(reward);
    }
  };

  const generateMathProblem = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    let answer = 0;
    
    switch (op) {
      case '+': answer = a + b; break;
      case '-': answer = a - b; break;
      case '*': answer = a * b; break;
    }
    
    setMathProblem({ a, b, op, answer });
    setUserAnswer('');
  };

  const checkMathAnswer = () => {
    if (parseInt(userAnswer) === mathProblem.answer) {
      setScore((s) => s + 1);
      generateMathProblem();
    }
  };

  const generateDictation = () => {
    const isError = Math.random() > 0.5;
    setHasError(isError);
    if (isError) {
      setDictationWord(errorWords[Math.floor(Math.random() * errorWords.length)]);
    } else {
      setDictationWord(correctWords[Math.floor(Math.random() * correctWords.length)]);
    }
  };

  const checkDictation = (userSaysError: boolean) => {
    if (userSaysError === hasError) {
      setScore((s) => s + 1);
    }
    generateDictation();
  };

  const handleSpeedClick = () => {
    setSpeedClicks((c) => c + 1);
    if (speedClicks + 1 >= 100) {
      endGame(true);
    }
  };

  const generateMemorySequence = () => {
    const seq: string[] = [];
    for (let i = 0; i < 4; i++) {
      seq.push(memoryColors[Math.floor(Math.random() * memoryColors.length)]);
    }
    setMemorySequence(seq);
    setUserSequence([]);
    setShowingSequence(true);
    
    setTimeout(() => {
      setShowingSequence(false);
    }, 2000);
  };

  const handleMemoryClick = (color: string) => {
    if (showingSequence) return;
    
    const newSeq = [...userSequence, color];
    setUserSequence(newSeq);
    
    if (newSeq[newSeq.length - 1] !== memorySequence[newSeq.length - 1]) {
      endGame(false);
    } else if (newSeq.length === memorySequence.length) {
      setScore((s) => s + 1);
      generateMemorySequence();
    }
  };

  if (!activeGame) {
    return (
      <div className="px-4 py-2">
        <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white mb-4">
          ← Назад
        </button>
        
        <h2 className="text-2xl font-bold mb-4">🎮 Мини-игры</h2>
        
        <div className="grid gap-4">
          {miniGames.map((miniGame) => (
            <div
              key={miniGame.id}
              className="bg-white/10 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{miniGame.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold">{miniGame.name}</p>
                  <p className="text-sm text-white/60">{miniGame.description}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">🏆 Награда: {miniGame.reward}💰</span>
                <button
                  onClick={() => startGame(miniGame.id)}
                  className="px-4 py-2 bg-green-500 rounded-lg font-bold hover:bg-green-400 transition-all"
                >
                  Играть
                </button>
              </div>
            </div>
          ))}
          
          {/* Speed Challenge */}
          <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 rounded-xl p-4 border border-yellow-400/30">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">⚡</span>
              <div className="flex-1">
                <p className="font-bold">Скоростной челлендж</p>
                <p className="text-sm text-white/60">Накликай 200 за минуту</p>
              </div>
            </div>
            <p className="text-yellow-400 mb-3">🏆 Рекорд: {game.state.speedRecord} в мин</p>
          </div>
        </div>
      </div>
    );
  }

  if (gameResult) {
    const reward = miniGames.find(g => g.id === activeGame)?.reward || 50;
    return (
      <div className="px-4 py-2 flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-8xl mb-4">{gameResult === 'win' ? '🎉' : '😢'}</span>
        <h2 className="text-3xl font-bold mb-2">
          {gameResult === 'win' ? 'Победа!' : 'Поражение'}
        </h2>
        <p className="text-xl mb-4">
          {gameResult === 'win' ? `+${reward}💰` : 'Попробуй ещё раз'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => startGame(activeGame)}
            className="px-6 py-3 bg-green-500 rounded-xl font-bold"
          >
            Ещё раз
          </button>
          <button
            onClick={() => setActiveGame(null)}
            className="px-6 py-3 bg-gray-600 rounded-xl font-bold"
          >
            К списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setActiveGame(null)} className="text-white/70 hover:text-white">
          ← Выход
        </button>
        <div className="text-xl font-bold">⏱️ {timeLeft}с</div>
        <div className="text-xl font-bold">✨ {score}</div>
      </div>

      {/* Math Game */}
      {activeGame === 'math_example' && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h3 className="text-2xl font-bold mb-6">Реши пример:</h3>
          <div className="text-6xl font-bold mb-6">
            {mathProblem.a} {mathProblem.op} {mathProblem.b} = ?
          </div>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="text-4xl text-center bg-white/10 rounded-xl p-4 w-40 mb-4"
            autoFocus
          />
          <button
            onClick={checkMathAnswer}
            className="px-8 py-3 bg-green-500 rounded-xl font-bold text-xl"
          >
            Проверить
          </button>
        </div>
      )}

      {/* Dictation Game */}
      {activeGame === 'dictation' && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h3 className="text-2xl font-bold mb-6">Есть ошибка?</h3>
          <div className="text-4xl font-bold mb-8 bg-white/10 px-6 py-3 rounded-xl">
            {dictationWord}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => checkDictation(true)}
              className="px-8 py-4 bg-red-500 rounded-xl font-bold text-xl"
            >
              ❌ Есть ошибка
            </button>
            <button
              onClick={() => checkDictation(false)}
              className="px-8 py-4 bg-green-500 rounded-xl font-bold text-xl"
            >
              ✅ Всё верно
            </button>
          </div>
        </div>
      )}

      {/* Speed Click Game */}
      {activeGame === 'speed_click' && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h3 className="text-2xl font-bold mb-6">Кликни 100 раз!</h3>
          <div className="text-6xl font-bold mb-6">{speedClicks}/100</div>
          <button
            onClick={handleSpeedClick}
            className="w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-4xl font-bold active:scale-95 transition-transform shadow-lg shadow-orange-500/30"
          >
            КЛИК!
          </button>
        </div>
      )}

      {/* Memory Game */}
      {activeGame === 'memory_game' && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h3 className="text-2xl font-bold mb-6">
            {showingSequence ? 'Запомни!' : 'Повтори!'}
          </h3>
          {showingSequence && (
            <div className="text-4xl mb-4">
              {memorySequence.map((color, i) => (
                <span key={i} className="mx-1">{color}</span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {memoryColors.map((color) => (
              <button
                key={color}
                onClick={() => handleMemoryClick(color)}
                disabled={showingSequence}
                className={`w-20 h-20 rounded-xl text-3xl flex items-center justify-center ${
                  showingSequence ? 'bg-gray-700' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
