import { useCallback, useMemo } from 'react';
import { RobotState, RobotEvent } from '../types';

interface StateTransition {
  [key: string]: RobotState;
}

const STATE_TRANSITIONS: StateTransition = {
  // Typing events
  'TYPING_START': 'thinking',
  'TYPING_END': 'idle',
  
  // Message events
  'MESSAGE_SENT': 'reading',
  'MESSAGE_RECEIVED': 'speaking',
  
  // Lesson events
  'LESSON_START': 'reading',
  'LESSON_END': 'idle',
  
  // Quiz events
  'QUIZ_START': 'thinking',
  'QUIZ_CORRECT': 'excited',
  'QUIZ_WRONG': 'confused',
  'QUIZ_COMPLETE': 'celebrating',
  
  // Error handling
  'ERROR': 'confused',
  
  // Default
  'IDLE': 'idle',
};

const STATE_DURATIONS: Partial<Record<RobotState, number>> = {
  celebrating: 3000,
  excited: 2000,
  confused: 2500,
  speaking: 0, // Controlled by speech
  reading: 0,  // Controlled by content
};

export const useRobotState = (
  _initialState: RobotState = 'idle',
  _onStateChange?: (state: RobotState) => void
) => {
  const getNextState = useCallback((event: RobotEvent): RobotState => {
    return STATE_TRANSITIONS[event] || 'idle';
  }, []);

  const shouldAutoReset = useCallback((state: RobotState): boolean => {
    return STATE_DURATIONS[state] !== undefined && STATE_DURATIONS[state]! > 0;
  }, []);

  const getDuration = useCallback((state: RobotState): number => {
    return STATE_DURATIONS[state] || 0;
  }, []);

  const stateConfig = useMemo(() => ({
    idle: { emoji: '🤖', label: 'Ready', animation: 'breathe' },
    reading: { emoji: '👀', label: 'Reading', animation: 'focus' },
    speaking: { emoji: '💬', label: 'Speaking', animation: 'speak' },
    excited: { emoji: '🎉', label: 'Great!', animation: 'bounce' },
    thinking: { emoji: '🤔', label: 'Thinking...', animation: 'tilt' },
    confused: { emoji: '😕', label: 'Hmm...', animation: 'wobble' },
    celebrating: { emoji: '🏆', label: 'Amazing!', animation: 'spin' },
  }), []);

  return {
    getNextState,
    shouldAutoReset,
    getDuration,
    stateConfig,
  };
};

export const analyzeContent = (text: string): RobotState => {
  const lower = text.toLowerCase();
  
  if (/!{2,}|\b(wow|amazing|perfect|excellent|congratulations)\b/.test(lower)) {
    return 'excited';
  }
  
  if (/\?{2,}|\b(what|how|why|when|where|think|explain)\b/.test(lower)) {
    return 'thinking';
  }
  
  if (/\b(error|warning|wrong|incorrect|failed)\b/.test(lower)) {
    return 'confused';
  }
  
  return 'reading';
};
