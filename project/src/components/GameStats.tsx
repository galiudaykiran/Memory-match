import React from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { difficultyConfig } from '../utils/gameHelpers';
import { Clock, Zap, Trophy, Award } from 'lucide-react';

const GameStats: React.FC = () => {
  const {
    timer,
    score,
    moves,
    difficulty,
    cards,
    timeElapsed,
    bestScores,
    bestTimes,
    winStreak,
    theme,
  } = useGameStore();
  
  // Calculate matched pairs
  const matchedCards = cards.filter(card => card.isMatched).length;
  const totalPairs = difficultyConfig[difficulty].cardCount;
  const matchedPairs = matchedCards / 2;
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    if (seconds === Infinity) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <motion.div 
      className={`w-full max-w-5xl mx-auto p-4 rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-md mt-4 mb-2`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Timer */}
        <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-amber-50' : 'bg-amber-900/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={18} className={theme === 'light' ? 'text-amber-600' : 'text-amber-400'} />
            <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'}`}>
              Time
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'light' ? 'text-amber-700' : 'text-amber-200'}`}>
            {formatTime(timer)}
          </p>
        </div>
        
        {/* Moves */}
        <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className={theme === 'light' ? 'text-blue-600' : 'text-blue-400'} />
            <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
              Moves
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-700' : 'text-blue-200'}`}>
            {moves}
          </p>
        </div>
        
        {/* Score */}
        <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-emerald-50' : 'bg-emerald-900/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={18} className={theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'} />
            <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-300'}`}>
              Score
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-200'}`}>
            {score}
          </p>
        </div>
        
        {/* Matches */}
        <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Award size={18} className={theme === 'light' ? 'text-purple-600' : 'text-purple-400'} />
            <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-purple-800' : 'text-purple-300'}`}>
              Matches
            </h3>
          </div>
          <p className={`text-2xl font-bold ${theme === 'light' ? 'text-purple-700' : 'text-purple-200'}`}>
            {matchedPairs}/{totalPairs}
          </p>
        </div>
      </div>
      
      <div className={`mt-3 pt-3 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className={`text-xs font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Best Score
            </p>
            <p className={`font-semibold ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>
              {bestScores[difficulty] || 0}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Best Time
            </p>
            <p className={`font-semibold ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>
              {formatTime(bestTimes[difficulty])}
            </p>
          </div>
          <div>
            <p className={`text-xs font-medium mb-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Win Streak
            </p>
            <p className={`font-semibold ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>
              {winStreak}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameStats;