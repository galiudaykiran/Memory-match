import { useEffect, useRef } from 'react';
import useGameStore from '../store/gameStore';

const useGameTimer = () => {
  const updateTimer = useGameStore(state => state.updateTimer);
  const isPlaying = useGameStore(state => state.isPlaying);
  const isPaused = useGameStore(state => state.isPaused);
  const isGameOver = useGameStore(state => state.isGameOver);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start the timer if the game is playing and not paused
    if (isPlaying && !isPaused && !isGameOver) {
      timerRef.current = window.setInterval(() => {
        updateTimer();
      }, 1000);
    }

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isPaused, isGameOver, updateTimer]);
};

export default useGameTimer;