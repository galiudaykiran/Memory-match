import { Card, Difficulty, DifficultyConfig, GameState } from '../types/game';

// Card emoji symbols for the game
const cardSymbols = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🐧', '🐦', '🦆', '🦉', '🦇', '🐺', '🐗', '🐴',
  '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟',
  '🦗', '🕷', '🕸', '🦂', '🦞', '🦐', '🦑', '🐙',
  '🦕', '🦖', '🦎', '🐍', '🐢', '🐊', '🐅', '🐆',
];

// Difficulty configurations
export const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  easy: {
    gridSize: 4, // 4x4 grid
    cardCount: 8, // 8 pairs
    timeLimit: 120,
  },
  medium: {
    gridSize: 6, // 6x6 grid (but we'll use 6x5 = 30 cards = 15 pairs)
    cardCount: 15,
    timeLimit: 180,
  },
  hard: {
    gridSize: 6, // 6x6 grid
    cardCount: 18,
    timeLimit: 240,
  },
  expert: {
    gridSize: 8, // 8x8 grid (but we'll use 8x6 = 48 cards = 24 pairs)
    cardCount: 24,
    timeLimit: 300,
  },
};

// Create shuffled cards for game
export const createCards = (difficulty: Difficulty): Card[] => {
  const { cardCount } = difficultyConfig[difficulty];
  
  // Get unique symbols for this game
  const gameSymbols = cardSymbols.slice(0, cardCount);
  
  // Create pairs of cards
  const cards: Card[] = [];
  gameSymbols.forEach((symbol, index) => {
    // Create two cards with the same symbol (a pair)
    cards.push(
      {
        id: index * 2,
        value: symbol,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: index * 2 + 1,
        value: symbol,
        isFlipped: false,
        isMatched: false,
      }
    );
  });
  
  // Shuffle the cards
  return shuffleCards(cards);
};

// Shuffle an array using Fisher-Yates algorithm
export const shuffleCards = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Calculate score based on time, moves, and difficulty
export const calculateScore = (
  difficulty: Difficulty,
  timeElapsed: number,
  moves: number,
  matchedPairs: number
): number => {
  const { timeLimit, cardCount } = difficultyConfig[difficulty];
  
  // Base score depending on difficulty
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    expert: 3,
  };
  
  // Time bonus (more time left = higher bonus)
  const timeBonus = Math.max(0, timeLimit - timeElapsed) * 5;
  
  // Move efficiency bonus (fewer moves = higher bonus)
  const perfectMoves = cardCount * 2; // minimum possible moves
  const moveEfficiency = Math.max(0, 1 - (moves - perfectMoves) / (perfectMoves * 2));
  const moveBonus = moveEfficiency * 1000;
  
  // Matched pairs bonus
  const matchedBonus = matchedPairs * 100;
  
  // Calculate final score
  const rawScore = (
    (matchedBonus + timeBonus + moveBonus) * 
    difficultyMultiplier[difficulty]
  );
  
  return Math.round(rawScore);
};

// Check if the game is over (all cards are matched)
export const isGameCompleted = (cards: Card[]): boolean => {
  return cards.every(card => card.isMatched);
};

// Get initial game state
export const getInitialGameState = (): GameState => {
  return {
    cards: [],
    difficulty: 'easy',
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    score: 0,
    timer: 0,
    moves: 0,
    flippedCards: [],
    timeElapsed: 0,
    bestScores: {
      easy: 0,
      medium: 0,
      hard: 0,
      expert: 0,
    },
    bestTimes: {
      easy: Infinity,
      medium: Infinity,
      hard: Infinity,
      expert: Infinity,
    },
    winStreak: 0,
    theme: 'light',
    soundEnabled: true,
    musicEnabled: true,
  };
};