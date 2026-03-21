import { useState, useEffect, useCallback, useRef } from 'react';
import { SpeakOptions, RobotState } from '../types';

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isPaused: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  speak: (text: string, options?: SpeakOptions) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setVoice: (voice: SpeechSynthesisVoice) => void;
}

export const useSpeechSynthesis = (
  onStateChange?: (state: RobotState) => void
): UseSpeechSynthesisReturn => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const queueRef = useRef<string[]>([]);
  const isProcessingRef = useRef(false);

  // Load voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      if (!selectedVoice && availableVoices.length > 0) {
        const englishVoice = availableVoices.find(
          v => v.lang.startsWith('en') && v.name.includes('Google')
        ) || availableVoices.find(v => v.lang.startsWith('en'));
        
        setSelectedVoice(englishVoice || availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const processQueue = useCallback(() => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    const text = queueRef.current.shift()!;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      onStateChange?.('speaking');
    };

    utterance.onend = () => {
      isProcessingRef.current = false;
      
      if (queueRef.current.length > 0) {
        processQueue();
      } else {
        setIsSpeaking(false);
        onStateChange?.('idle');
      }
    };

    utterance.onerror = () => {
      isProcessingRef.current = false;
      setIsSpeaking(false);
      queueRef.current = [];
      onStateChange?.('confused');
    };

    window.speechSynthesis.speak(utterance);
  }, [selectedVoice, onStateChange]);

  const speak = useCallback(async (text: string, options?: SpeakOptions): Promise<void> => {
    if (!text || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    queueRef.current = [];
    isProcessingRef.current = false;

    // Split long text into chunks
    const chunks = splitTextIntoChunks(text, 1500);
    queueRef.current.push(...chunks);
    
    // Apply custom options to first chunk
    if (options?.rate) {
      // Rate will be applied when processing
    }

    return new Promise((resolve) => {
      processQueue();
      
      // Resolve when all chunks are done
      const checkComplete = setInterval(() => {
        if (!isSpeaking && queueRef.current.length === 0) {
          clearInterval(checkComplete);
          resolve();
        }
      }, 100);
    });
  }, [processQueue, isSpeaking]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    queueRef.current = [];
    isProcessingRef.current = false;
    setIsSpeaking(false);
    setIsPaused(false);
    onStateChange?.('idle');
  }, [onStateChange]);

  const pause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      onStateChange?.('thinking');
    }
  }, [isSpeaking, isPaused, onStateChange]);

  const resume = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      onStateChange?.('speaking');
    }
  }, [isPaused, onStateChange]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    localStorage.setItem('robotVoice', voice.name);
  }, []);

  return {
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    speak,
    stop,
    pause,
    resume,
    setVoice,
  };
};

const splitTextIntoChunks = (text: string, maxLength: number = 1500): string[] => {
  if (text.length <= maxLength) return [text];
  
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + ' ' + sentence).trim().length > maxLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk = (currentChunk + ' ' + sentence).trim();
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};
