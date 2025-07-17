import { create } from 'zustand';
import { Card, Difficulty, GameState } from '../types/game';
import { 
  calculateScore, 
  createCards, 
  difficultyConfig, 
  getInitialGameState, 
  isGameCompleted 
} from '../utils/gameHelpers';

interface GameActions {
  startGame: (difficulty: Difficulty) => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  flipCard: (cardId: number) => void;
  updateTimer: () => void;
  endGame: (isVictory: boolean) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleTheme: () => void;
}

const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...getInitialGameState(),

  startGame: (difficulty: Difficulty) => {
    const cards = createCards(difficulty);
    const { timeLimit } = difficultyConfig[difficulty];
    
    set({
      cards,
      difficulty,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      isVictory: false,
      score: 0,
      timer: timeLimit,
      moves: 0,
      flippedCards: [],
      timeElapsed: 0,
    });
  },

  resetGame: () => {
    set({
      ...getInitialGameState(),
      theme: get().theme,
      soundEnabled: get().soundEnabled,
      musicEnabled: get().musicEnabled,
      bestScores: get().bestScores,
      bestTimes: get().bestTimes,
      winStreak: get().winStreak,
    });
  },

  pauseGame: () => {
    if (get().isPlaying && !get().isPaused) {
      set({ isPaused: true });
    }
  },

  resumeGame: () => {
    if (get().isPlaying && get().isPaused) {
      set({ isPaused: false });
    }
  },

  flipCard: (cardId: number) => {
    const { cards, flippedCards, isPlaying, isPaused, moves } = get();
    
    // Don't allow flipping if game is not playing or is paused
    if (!isPlaying || isPaused) return;
    
    // Find the card
    const card = cards.find(c => c.id === cardId);
    
    // Don't allow flipping if card is already flipped or matched
    if (!card || card.isFlipped || card.isMatched) return;
    
    // If we already have 2 cards flipped, don't allow flipping a third
    if (flippedCards.length >= 2) return;
    
    // Flip the card
    const updatedCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    
    // Add card to flipped cards and increment moves if this is a new flip
    const newFlippedCards = [...flippedCards, cardId];
    const newMoves = flippedCards.length === 0 ? moves : moves + 1;
    
    set({ 
      cards: updatedCards, 
      flippedCards: newFlippedCards,
      moves: newMoves,
    });
    
    // If we now have 2 cards flipped, check for a match
    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = updatedCards.find(c => c.id === firstCardId);
      const secondCard = updatedCards.find(c => c.id === secondCardId);
      
      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          const matchedCards = updatedCards.map(c => 
            c.id === firstCardId || c.id === secondCardId
              ? { ...c, isMatched: true }
              : c
          );
          
          set({ 
            cards: matchedCards, 
            flippedCards: [],
          });
          
          // Check if game is completed
          if (isGameCompleted(matchedCards)) {
            get().endGame(true);
          }
        }, 500);
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          const resetCards = updatedCards.map(c => 
            newFlippedCards.includes(c.id)
              ? { ...c, isFlipped: false }
              : c
          );
          
          set({ 
            cards: resetCards, 
            flippedCards: [],
          });
        }, 1000);
      }
    }
  },

  updateTimer: () => {
    const { timer, isPlaying, isPaused, isGameOver, timeElapsed } = get();
    
    if (isPlaying && !isPaused && !isGameOver) {
      if (timer <= 0) {
        // Time's up
        get().endGame(false);
      } else {
        // Update timer
        set({ 
          timer: timer - 1,
          timeElapsed: timeElapsed + 1,
        });
      }
    }
  },

  endGame: (isVictory: boolean) => {
    const { difficulty, timeElapsed, moves, cards, bestScores, bestTimes, winStreak } = get();
    
    // Calculate matched pairs
    const matchedPairs = cards.filter(c => c.isMatched).length / 2;
    
    // Calculate final score
    const finalScore = isVictory
      ? calculateScore(difficulty, timeElapsed, moves, matchedPairs)
      : 0;
    
    // Update best score if needed
    const newBestScores = { ...bestScores };
    if (finalScore > bestScores[difficulty]) {
      newBestScores[difficulty] = finalScore;
    }
    
    // Update best time if needed
    const newBestTimes = { ...bestTimes };
    if (isVictory && timeElapsed < bestTimes[difficulty]) {
      newBestTimes[difficulty] = timeElapsed;
    }
    
    // Update win streak
    const newWinStreak = isVictory ? winStreak + 1 : 0;
    
    set({
      isPlaying: false,
      isGameOver: true,
      isVictory,
      score: finalScore,
      bestScores: newBestScores,
      bestTimes: newBestTimes,
      winStreak: newWinStreak,
    });
  },

  toggleSound: () => {
    set({ soundEnabled: !get().soundEnabled });
  },

  toggleMusic: () => {
    set({ musicEnabled: !get().musicEnabled });
  },

  toggleTheme: () => {
    set({ theme: get().theme === 'light' ? 'dark' : 'light' });
  },
}));

export default useGameStore;