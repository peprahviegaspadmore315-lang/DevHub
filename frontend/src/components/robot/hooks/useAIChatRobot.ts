import { useCallback, useRef } from 'react';
import { useRobot } from '../context';

interface UseAIChatRobotReturn {
  onAiResponse: (message: string) => void;
  onAiThinking: () => void;
  onAiError: () => void;
}

export const useAIChatRobot = (): UseAIChatRobotReturn => {
  const { dispatch, stop } = useRobot();
  const isProcessingRef = useRef(false);

  const onAiThinking = useCallback(() => {
    dispatch('THINKING');
  }, [dispatch]);

  const onAiResponse = useCallback((message: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    dispatch('MESSAGE_RECEIVED', message);

    setTimeout(() => {
      isProcessingRef.current = false;
    }, 500);
  }, [dispatch]);

  const onAiError = useCallback(() => {
    stop();
    dispatch('ERROR');
  }, [stop, dispatch]);

  return {
    onAiThinking,
    onAiResponse,
    onAiError,
  };
};
