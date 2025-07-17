import React from 'react';
import { motion } from 'framer-motion';
import { Difficulty } from '../types/game';
import useGameStore from '../store/gameStore';
import useSoundEffects from '../hooks/useSound';
import { Pause, Play, RotateCcw, Volume2, Volume, Music, Music2, Sun, Moon } from 'lucide-react';

const GameControls: React.FC = () => {
  const {
    isPlaying,
    isPaused,
    difficulty,
    startGame,
    resetGame,
    pauseGame,
    resumeGame,
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
    toggleTheme,
    theme,
  } = useGameStore();
  
  const { playSound } = useSoundEffects();
  
  const difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty>(difficulty);
  
  const handleStartGame = () => {
    playSound('start');
    startGame(selectedDifficulty);
  };
  
  const handleResetGame = () => {
    playSound('click');
    resetGame();
  };
  
  const handlePauseResume = () => {
    playSound('click');
    isPaused ? resumeGame() : pauseGame();
  };
  
  const handleDifficultyChange = (difficulty: Difficulty) => {
    playSound('click');
    setSelectedDifficulty(difficulty);
  };
  
  const buttonBaseClass = `px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2`;
  const buttonPrimaryClass = `${buttonBaseClass} ${theme === 'light' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-700 hover:bg-indigo-600 text-white'}`;
  const buttonSecondaryClass = `${buttonBaseClass} ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-800 hover:bg-gray-700 text-white'}`;
  
  return (
    <motion.div 
      className={`w-full max-w-5xl mx-auto p-4 rounded-xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} shadow-md mb-4`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {!isPlaying ? (
          // Game setup controls (when not playing)
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className={`block mb-2 font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                Difficulty
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {difficultyOptions.map(option => (
                  <button
                    key={option}
                    className={`px-3 py-2 rounded-lg capitalize ${
                      selectedDifficulty === option
                        ? theme === 'light'
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'bg-indigo-900 text-indigo-200 border border-indigo-700'
                        : theme === 'light'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => handleDifficultyChange(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end mt-2">
              <button
                className={buttonPrimaryClass}
                onClick={handleStartGame}
              >
                Start Game
              </button>
            </div>
          </div>
        ) : (
          // In-game controls (when playing)
          <div className="w-full flex flex-wrap justify-between items-center gap-2">
            <button
              className={buttonSecondaryClass}
              onClick={handlePauseResume}
            >
              {isPaused ? <Play size={18} /> : <Pause size={18} />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            
            <button
              className={buttonSecondaryClass}
              onClick={handleResetGame}
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        )}
        
        {/* Settings controls (always visible) */}
        <div className="w-full flex justify-end gap-2 mt-2">
          <button
            className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => {
              playSound('click');
              toggleSound();
            }}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <Volume size={20} className="opacity-50" />}
          </button>
          
          <button
            className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => {
              playSound('click');
              toggleMusic();
            }}
            title={musicEnabled ? 'Mute music' : 'Enable music'}
          >
            {musicEnabled ? <Music size={20} /> : <Music2 size={20} className="opacity-50" />}
          </button>
          
          <button
            className={`p-2 rounded-lg ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => {
              playSound('click');
              toggleTheme();
            }}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameControls;