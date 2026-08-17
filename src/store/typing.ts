import { create } from "zustand";

interface TypingStore {
  // Test settings
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  mode: "solo" | "friend";
  roomCode: string | null;
  
  // Test state
  isStarted: boolean;
  isFinished: boolean;
  currentTime: number;
  currentCharIndex: number;
  currentWordIndex: number;
  typedChars: string[];
  correctChars: number;
  incorrectChars: number;
  wpm: number;
  accuracy: number;
  maxWpm: number;
  text: string;
  words: string[];
  
  // Multiplayer
  opponentWpm: number;
  opponentAccuracy: number;
  opponentProgress: number;
  
  // Actions
  setDifficulty: (d: "easy" | "medium" | "hard") => void;
  setTimeLimit: (t: number) => void;
  setMode: (m: "solo" | "friend") => void;
  setRoomCode: (code: string | null) => void;
  setText: (text: string) => void;
  startTest: () => void;
  finishTest: () => void;
  tick: () => void;
  typeChar: (char: string) => void;
  deleteChar: () => void;
  moveWord: () => void;
  setOpponentData: (wpm: number, accuracy: number, progress: number) => void;
  reset: () => void;
}

export const useTypingStore = create<TypingStore>((set, get) => ({
  difficulty: "medium",
  timeLimit: 60,
  mode: "solo",
  roomCode: null,
  
  isStarted: false,
  isFinished: false,
  currentTime: 60,
  currentCharIndex: 0,
  currentWordIndex: 0,
  typedChars: [],
  correctChars: 0,
  incorrectChars: 0,
  wpm: 0,
  accuracy: 100,
  maxWpm: 0,
  text: "",
  words: [],
  
  opponentWpm: 0,
  opponentAccuracy: 100,
  opponentProgress: 0,
  
  setDifficulty: (d) => set({ difficulty: d }),
  setTimeLimit: (t) => set({ timeLimit: t, currentTime: t }),
  setMode: (m) => set({ mode: m }),
  setRoomCode: (code) => set({ roomCode: code }),
  setText: (text) => set({ text, words: text.split(" ") }),
  
  startTest: () => set({
    isStarted: true,
    isFinished: false,
    currentCharIndex: 0,
    currentWordIndex: 0,
    typedChars: [],
    correctChars: 0,
    incorrectChars: 0,
    wpm: 0,
    accuracy: 100,
    maxWpm: 0,
    currentTime: get().timeLimit,
  }),
  
  finishTest: () => set({ isFinished: true, isStarted: false }),
  
  tick: () => {
    const state = get();
    const newTime = state.currentTime - 1;
    if (newTime <= 0) {
      set({ currentTime: 0 });
      get().finishTest();
    } else {
      // Calculate WPM
      const elapsed = state.timeLimit - newTime;
      const wpm = elapsed > 0 ? Math.round((state.correctChars / 5) / (elapsed / 60)) : 0;
      const accuracy = (state.correctChars + state.incorrectChars) > 0
        ? Math.round((state.correctChars / (state.correctChars + state.incorrectChars)) * 100)
        : 100;
      set({
        currentTime: newTime,
        wpm,
        accuracy,
        maxWpm: Math.max(state.maxWpm, wpm),
      });
    }
  },
  
  typeChar: (char) => {
    const state = get();
    const currentWord = state.words[state.currentWordIndex];
    if (!currentWord) return;
    
    const expectedChar = currentWord[state.currentCharIndex];
    const isCorrect = char === expectedChar;
    
    const newTypedChars = [...state.typedChars, char];
    const newCorrectChars = state.correctChars + (isCorrect ? 1 : 0);
    const newIncorrectChars = state.incorrectChars + (isCorrect ? 0 : 1);
    
    set({
      typedChars: newTypedChars,
      currentCharIndex: state.currentCharIndex + 1,
      correctChars: newCorrectChars,
      incorrectChars: newIncorrectChars,
    });
    
    // Auto-advance word if completed
    if (state.currentCharIndex + 1 >= currentWord.length) {
      setTimeout(() => get().moveWord(), 0);
    }
  },
  
  deleteChar: () => {
    const state = get();
    if (state.currentCharIndex > 0) {
      const wasCorrect = state.typedChars[state.typedChars.length - 1] === 
        state.words[state.currentWordIndex][state.currentCharIndex - 1];
      set({
        currentCharIndex: state.currentCharIndex - 1,
        typedChars: state.typedChars.slice(0, -1),
        correctChars: state.correctChars - (wasCorrect ? 1 : 0),
        incorrectChars: state.incorrectChars - (wasCorrect ? 0 : 1),
      });
    } else if (state.currentWordIndex > 0) {
      // Go back to previous word
      const prevWord = state.words[state.currentWordIndex - 1];
      set({
        currentWordIndex: state.currentWordIndex - 1,
        currentCharIndex: prevWord.length,
        typedChars: state.typedChars.slice(0, -prevWord.length),
      });
    }
  },
  
  moveWord: () => {
    const state = get();
    set({
      currentWordIndex: state.currentWordIndex + 1,
      currentCharIndex: 0,
      typedChars: [],
    });
  },
  
  setOpponentData: (wpm, accuracy, progress) => set({
    opponentWpm: wpm,
    opponentAccuracy: accuracy,
    opponentProgress: progress,
  }),
  
  reset: () => set({
    isStarted: false,
    isFinished: false,
    currentTime: get().timeLimit,
    currentCharIndex: 0,
    currentWordIndex: 0,
    typedChars: [],
    correctChars: 0,
    incorrectChars: 0,
    wpm: 0,
    accuracy: 100,
    maxWpm: 0,
    opponentWpm: 0,
    opponentAccuracy: 100,
    opponentProgress: 0,
  }),
}));
