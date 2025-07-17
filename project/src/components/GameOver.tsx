import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import useGameStore from '../store/gameStore';
import useSoundEffects from '../hooks/useSound';
import { TrophyIcon, TimerIcon, ZapIcon, AlertTriangleIcon } from 'lucide-react';
import { difficultyConfig } from '../utils/gameHelpers';

const GameOver: React.FC = () => {
  const {
    isGameOver,
    isVictory,
    score,
    timeElapsed,
    moves,
    difficulty,
    resetGame,
    startGame,
    theme,
  } = useGameStore();
  
  const { playSound } = useSoundEffects();
  
  // Play victory/game over sound when the component mounts
  useEffect(() => {
    if (isGameOver) {
      playSound(isVictory ? 'victory' : 'gameOver');
    }
  }, [isGameOver, isVictory, playSound]);
  
  if (!isGameOver) return null;
  
  const { timeLimit } = difficultyConfig[difficulty];
  const timeUsed = isVictory ? timeElapsed : timeLimit;
  const timePercentage = Math.round((timeUsed / timeLimit) * 100);
  const moveEfficiency = Math.round((difficultyConfig[difficulty].cardCount * 2 / moves) * 100);
  
  const handlePlayAgain = () => {
    playSound('click');
    resetGame();
  };
  
  const handlePlaySameDifficulty = () => {
    playSound('start');
    startGame(difficulty);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4"
    >
      {isVictory && <Confetti recycle={false} numberOfPieces={500} />}
      
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`w-full max-w-md rounded-xl overflow-hidden shadow-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}
      >
        <div 
          className={`p-6 ${
            isVictory 
              ? theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-indigo-800 to-purple-900' 
              : theme === 'light' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-orange-800 to-red-900'
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isVictory ? 'Victory!' : 'Game Over'}
            </h2>
            <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
              {isVictory 
                ? <TrophyIcon size={32} className="text-yellow-300" /> 
                : <AlertTriangleIcon size={32} className="text-red-300" />
              }
            </div>
          </div>
          
          {isVictory && (
            <div className="mt-2 text-white/90">
              Congratulations! You've completed the {difficulty} level!
            </div>
          )}
          
          {!isVictory && (
            <div className="mt-2 text-white/90">
              Time's up! Better luck next time.
            </div>
          )}
        </div>
        
        <div className="p-6">
          {/* Stats */}
          <div className="space-y-4 mb-6">
            {/* Score */}
            {isVictory && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrophyIcon size={20} className={theme === 'light' ? 'text-amber-500' : 'text-amber-400'} />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Score</span>
                </div>
                <span className={`text-xl font-bold ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>
                  {score}
                </span>
              </div>
            )}
            
            {/* Time */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TimerIcon size={20} className={theme === 'light' ? 'text-blue-500' : 'text-blue-400'} />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Time Used</span>
                </div>
                <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium`}>
                  {timeUsed} sec ({timePercentage}%)
                </span>
              </div>
              <div 
                className={`w-full h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
              >
                <div 
                  className={`h-full ${
                    isVictory 
                      ? theme === 'light' ? 'bg-green-500' : 'bg-green-600' 
                      : theme === 'light' ? 'bg-red-500' : 'bg-red-600'
                  }`} 
                  style={{ width: `${timePercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Moves */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ZapIcon size={20} className={theme === 'light' ? 'text-purple-500' : 'text-purple-400'} />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>Move Efficiency</span>
                </div>
                <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium`}>
                  {moveEfficiency}%
                </span>
              </div>
              <div 
                className={`w-full h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}
              >
                <div 
                  className={`h-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-600'}`} 
                  style={{ width: `${moveEfficiency}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePlayAgain}
              className={`flex-1 px-4 py-2 rounded-lg ${
                theme === 'light' 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              New Game
            </button>
            <button
              onClick={handlePlaySameDifficulty}
              className={`flex-1 px-4 py-2 rounded-lg ${
                theme === 'light' 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-indigo-700 hover:bg-indigo-600 text-white'
              }`}
            >
              Play Again
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameOver;