export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
  gridSize: number;
  cardCount: number;
  timeLimit: number; // in seconds
}

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  difficulty: Difficulty;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  score: number;
  timer: number;
  moves: number;
  flippedCards: number[];
  timeElapsed: number;
  bestScores: Record<Difficulty, number>;
  bestTimes: Record<Difficulty, number>;
  winStreak: number;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  musicEnabled: boolean;
}