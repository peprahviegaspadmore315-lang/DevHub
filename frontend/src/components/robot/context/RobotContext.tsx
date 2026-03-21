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

  useEffect(() => {
    return () => {
      if (autoResetTimeoutRef.current) {
        clearTimeout(autoResetTimeoutRef.current);
      }
    };
  }, []);

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
