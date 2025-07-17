import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import useGameStore from '../store/gameStore';
import { difficultyConfig } from '../utils/gameHelpers';

const GameBoard: React.FC = () => {
  const cards = useGameStore(state => state.cards);
  const difficulty = useGameStore(state => state.difficulty);
  const theme = useGameStore(state => state.theme);
  
  const { gridSize } = difficultyConfig[difficulty];
  
  // Dynamic grid sizing based on difficulty
  const getGridClass = () => {
    switch (gridSize) {
      case 4: return 'grid-cols-4 gap-2 sm:gap-4';
      case 6: return 'grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3';
      case 8: return 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2';
      default: return 'grid-cols-4 gap-3';
    }
  };
  
  const gridClass = getGridClass();
  
  // Calculate aspect ratio for cards
  const getCardAspectRatio = () => {
    switch (gridSize) {
      case 4: return 'aspect-square';
      case 6: return 'aspect-square';
      case 8: return 'aspect-square sm:aspect-[3/4]';
      default: return 'aspect-square';
    }
  };
  
  const cardAspectRatio = getCardAspectRatio();
  
  return (
    <motion.div 
      className={`w-full max-w-5xl mx-auto grid ${gridClass} p-2 sm:p-4 rounded-xl ${theme === 'light' ? 'bg-indigo-50' : 'bg-gray-900'} shadow-lg`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {cards.map(card => (
        <div key={card.id} className={cardAspectRatio}>
          <Card card={card} />
        </div>
      ))}
    </motion.div>
  );
};

export default GameBoard;