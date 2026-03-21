import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTypingDetectionOptions {
  debounceMs?: number;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
}

interface UseTypingDetectionReturn {
  isTyping: boolean;
  handleInputChange: (value: string) => void;
  handleKeyDown: () => void;
  reset: () => void;
}

export const useTypingDetection = (
  options: UseTypingDetectionOptions = {}
): UseTypingDetectionReturn => {
  const {
    debounceMs = 1500,
    onTypingStart,
    onTypingEnd,
  } = options;

  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wasTypingRef = useRef(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    
    if (value.length > 0 && !wasTypingRef.current) {
      // Started typing
      wasTypingRef.current = true;
      setIsTyping(true);
      onTypingStart?.();
    }
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for end of typing
    if (value.length > 0) {
      timeoutRef.current = setTimeout(() => {
        wasTypingRef.current = false;
        setIsTyping(false);
        onTypingEnd?.();
      }, debounceMs);
    }
  }, [debounceMs, onTypingStart, onTypingEnd]);

  const handleKeyDown = useCallback(() => {
    // User pressed a key - reset the debounce timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (inputValue.length > 0) {
      timeoutRef.current = setTimeout(() => {
        wasTypingRef.current = false;
        setIsTyping(false);
        onTypingEnd?.();
      }, debounceMs);
    }
  }, [inputValue, debounceMs, onTypingEnd]);

  const reset = useCallback(() => {
    setInputValue('');
    setIsTyping(false);
    wasTypingRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    isTyping,
    handleInputChange,
    handleKeyDown,
    reset,
  };
};

// Analysis hook for message content
export const analyzeMessage = (message: string): 'excited' | 'question' | 'normal' => {
  const trimmed = message.trim();
  
  if (/!{2,}/.test(trimmed) || 
      /\?(?!\?)/.test(trimmed) ||
      /\b(help|urgent|asap|important)\b/i.test(trimmed)) {
    return 'excited';
  }
  
  if (/\?{2,}/.test(trimmed) || 
      /\b(what|how|why|when|where|explain)\b/i.test(trimmed)) {
    return 'question';
  }
  
  return 'normal';
};
