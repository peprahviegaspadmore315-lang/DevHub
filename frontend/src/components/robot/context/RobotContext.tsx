import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { RobotState, RobotEvent, RobotContextValue, SpeakOptions } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useRobotState as useRobotStateMachine } from '../hooks/useRobotState';

const RobotContext = createContext<RobotContextValue | null>(null);

interface RobotProviderProps {
  children: ReactNode;
}

export const RobotProvider = ({ children }: RobotProviderProps) => {
  const [state, setState] = useState<RobotState>('idle');
  const isTyping = false;
  const isListening = false;
  const autoResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { getNextState, getDuration, shouldAutoReset } = useRobotStateMachine();

  const handleStateChange = useCallback((newState: RobotState) => {
    setState(newState);
    
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
    }
    
    if (shouldAutoReset(newState)) {
      const duration = getDuration(newState);
      autoResetTimeoutRef.current = setTimeout(() => {
        setState('idle');
      }, duration);
    }
  }, [shouldAutoReset, getDuration]);

  const { isSpeaking, speak, stop, pause, resume } = useSpeechSynthesis(handleStateChange);

  const dispatch = useCallback((event: RobotEvent, payload?: unknown) => {
    const nextState = getNextState(event);
    
    switch (event) {
      case 'MESSAGE_RECEIVED':
        if (typeof payload === 'string') {
          speak(payload as string);
        }
        break;
      case 'QUIZ_CORRECT':
        setState('excited');
        if (typeof payload === 'string') {
          speak(payload as string);
        }
        break;
      case 'QUIZ_COMPLETE':
        setState('celebrating');
        speak('Congratulations! You completed the quiz!');
        break;
      case 'EVALUATION_START':
        setState('thinking');
        speak('Let me check your answer...');
        break;
      case 'EVALUATION_GOOD':
        if (typeof payload === 'object' && payload !== null) {
          const evalPayload = payload as { score: number; feedback: string };
          if (evalPayload.score >= 80) {
            setState('excited');
            speak(`Great job! You scored ${evalPayload.score} out of 100! ${evalPayload.feedback}`);
          } else if (evalPayload.score >= 60) {
            setState('speaking');
            speak(`Good effort! You scored ${evalPayload.score}. ${evalPayload.feedback}`);
          } else {
            setState('thinking');
            speak(`Let's review this together. You scored ${evalPayload.score}. ${evalPayload.feedback}`);
          }
        }
        break;
      case 'EVALUATION_BAD':
        setState('thinking');
        if (typeof payload === 'string') {
          speak(`No worries! Let's work on this together. ${payload}`);
        }
        break;
      case 'TYPING_START':
      case 'THINKING':
        setState('thinking');
        break;
      case 'TYPING_END':
        if (state === 'thinking') {
          setState('idle');
        }
        break;
      default:
        setState(nextState);
    }
  }, [getNextState, speak, state]);

  useEffect(() => {
    (window as any).__robot = { dispatch, speak };
    return () => {
      delete (window as any).__robot;
    };
  }, [dispatch, speak]);

  const speakText = useCallback(async (text: string, options?: SpeakOptions) => {
    await speak(text, options);
  }, [speak]);

  const value: RobotContextValue = {
    state,
    isTyping,
    isSpeaking,
    isListening,
    setState,
    dispatch,
    speak: speakText,
    stop,
    pause,
    resume,
  };

  return (
    <RobotContext.Provider value={value}>
      {children}
    </RobotContext.Provider>
  );
};

export const useRobot = (): RobotContextValue => {
  const context = useContext(RobotContext);
  if (!context) {
    throw new Error('useRobot must be used within a RobotProvider');
  }
  return context;
};

export const useRobotStateInfo = () => {
  const { state, isTyping, isSpeaking, isListening } = useRobot();
  return { state, isTyping, isSpeaking, isListening };
};

export const useRobotActions = () => {
  const { dispatch, speak, stop, pause, resume, setState } = useRobot();
  return { dispatch, speak, stop, pause, resume, setState };
};
