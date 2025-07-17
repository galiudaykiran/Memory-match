import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../types/game';
import useGameStore from '../store/gameStore';
import useSoundEffects from '../hooks/useSound';

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const theme = useGameStore(state => state.theme);
  const flipCard = useGameStore(state => state.flipCard);
  const isPlaying = useGameStore(state => state.isPlaying);
  const isPaused = useGameStore(state => state.isPaused);
  const { playSound } = useSoundEffects();

  const handleClick = () => {
    if (!isPlaying || isPaused || card.isFlipped || card.isMatched) return;
    
    playSound('flip');
    flipCard(card.id);
  };

  // Determine card colors based on theme and state
  const getCardStyles = () => {
    if (theme === 'light') {
      return {
        front: card.isMatched 
          ? 'bg-emerald-100 border-emerald-400' 
          : 'bg-white border-indigo-300',
        back: 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-700'
      };
    } else {
      return {
        front: card.isMatched 
          ? 'bg-emerald-900 border-emerald-700' 
          : 'bg-gray-800 border-indigo-700',
        back: 'bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-800'
      };
    }
  };

  const styles = getCardStyles();
  
  return (
    <div className="perspective-1000 w-full h-full">
      <motion.div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer rounded-xl`}
        whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
        onClick={handleClick}
        initial={false}
        animate={{
          rotateY: card.isFlipped || card.isMatched ? 180 : 0,
          scale: card.isMatched ? 0.95 : 1
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20
        }}
      >
        {/* Card Back */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl border-2 shadow-lg flex items-center justify-center text-white font-bold ${styles.back}`}
        >
          <div className="text-3xl">🎮</div>
        </div>

        {/* Card Front */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl border-2 shadow-md flex items-center justify-center transform rotate-y-180 ${styles.front} ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
        >
          <div className="text-4xl">{card.value}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Card;