import React, { useEffect } from 'react';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import GameStats from './components/GameStats';
import GameOver from './components/GameOver';
import useGameTimer from './hooks/useGameTimer';
import useGameStore from './store/gameStore';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

function App() {
  // Initialize the game timer
  useGameTimer();
  
  // Get game state
  const isPlaying = useGameStore(state => state.isPlaying);
  const theme = useGameStore(state => state.theme);
  
  // Update document title
  useEffect(() => {
    document.title = 'Memory Match Game';
    
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      htmlElement.style.backgroundColor = '#1a1a1a';
      document.body.style.backgroundColor = '#1a1a1a';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.style.backgroundColor = '#f5f7fa';
      document.body.style.backgroundColor = '#f5f7fa';
    }
  }, [theme]);
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900 text-white'}`}>
      <header className="w-full max-w-7xl mx-auto p-4">
        <div className="flex justify-center md:justify-start items-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-12 h-12 rounded-xl ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-700'} text-white flex items-center justify-center mr-3`}
          >
            <Brain size={28} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold"
          >
            Memory Match
          </motion.h1>
        </div>
      </header>
      
      <main className="w-full max-w-7xl mx-auto px-4 pb-8">
        <GameControls />
        
        {isPlaying && <GameStats />}
        
        <GameBoard />
        
        <GameOver />
      </main>
      
      <footer className={`w-full max-w-7xl mx-auto p-4 text-center text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
        <p>Challenge your memory skills and have fun!</p>
      </footer>
    </div>
  );
}

export default App;