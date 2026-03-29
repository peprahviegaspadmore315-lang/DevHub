import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface AIAssistantLearningContext {
  source: string;
  route?: string;
  language?: string;
  courseId?: number;
  courseTitle?: string;
  topicSlug?: string;
  topicTitle?: string;
  topicSummary?: string;
  lessonId?: number;
  lessonTitle?: string;
  lessonContent?: string;
  codeExample?: string;
}

export type AIAssistantTab = 'chat' | 'explain' | 'quiz' | 'reading';

interface AIAssistantContextProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: AIAssistantTab;
  setActiveTab: (tab: AIAssistantTab) => void;
  openAssistantTab: (tab: AIAssistantTab) => void;
  learningContext: AIAssistantLearningContext | null;
  setLearningContext: (context: AIAssistantLearningContext | null) => void;
  clearLearningContext: () => void;
  explainCodeDraft: string;
  setExplainCodeDraft: (code: string) => void;
  explainLanguageDraft: string;
  setExplainLanguageDraft: (language: string) => void;
  // Reading state
  readingText: string;
  setReadingText: (text: string) => void;
  isReading: boolean;
  isPaused: boolean;
  currentWordIndex: number;
  startReading: (text?: string) => void;
  resumeReading: () => void;
  pauseReading: () => void;
  stopReading: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextProps | undefined>(undefined);

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AIAssistantTab>('chat');
  const [learningContext, setLearningContext] = useState<AIAssistantLearningContext | null>(null);
  const [explainCodeDraft, setExplainCodeDraft] = useState('');
  const [explainLanguageDraft, setExplainLanguageDraft] = useState('');
  // Reading state
  const [readingText, setReadingText] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const readingTextRef = useRef(readingText);

  useEffect(() => {
    readingTextRef.current = readingText;
  }, [readingText]);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const clearLearningContext = useCallback(() => {
    setLearningContext(null);
  }, []);

  const openAssistantTab = useCallback((tab: AIAssistantTab) => {
    setActiveTab(tab);
    setIsOpen(true);
  }, []);

  // Reading actions
  const startReading = (text?: string) => {
    if (
      typeof window === 'undefined' ||
      typeof window.speechSynthesis === 'undefined' ||
      typeof (window as any).SpeechSynthesisUtterance === 'undefined'
    ) {
      throw new Error('Speech synthesis is not supported in this browser')
    }

    const normalizedOverride = text?.trim() ?? '';
    const hasOverride = normalizedOverride.length > 0;

    if (hasOverride) {
      readingTextRef.current = normalizedOverride;
      setReadingText(normalizedOverride);
    }

    const normalizedText = hasOverride ? normalizedOverride : readingTextRef.current.trim();
    if (!normalizedText) return;

    if (!hasOverride && utteranceRef.current && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsReading(true);
      setIsPaused(false);
      return;
    }

    setIsReading(true);
    setIsPaused(false);
    setCurrentWordIndex(0);

    // Cancel any ongoing utterance
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    const SpeechSynthesisUtteranceCtor = (window as any).SpeechSynthesisUtterance;
    const utterance = new SpeechSynthesisUtteranceCtor(normalizedText);
    utteranceRef.current = utterance;

    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      // Update the current word index based on the boundary event
      // event.charIndex is the index of the character where the boundary occurred
      // We'll approximate the word index by counting spaces up to that index
      const textSoFar = normalizedText.substring(0, event.charIndex);
      const wordIndex = textSoFar.trim().split(/\s+/).length;
      setCurrentWordIndex(wordIndex);
    };

    utterance.onpause = () => {
      setIsReading(false);
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsReading(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      setCurrentWordIndex(0);
      utteranceRef.current = null;
    };
    window.speechSynthesis.speak(utterance);
  };

  const resumeReading = () => {
    if (utteranceRef.current && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsReading(true);
      setIsPaused(false);
      return;
    }

    startReading();
  };

  const pauseReading = () => {
    if (utteranceRef.current && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsReading(false);
      setIsPaused(true);
    }
  };

  const stopReading = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setIsReading(false);
      setIsPaused(false);
      setCurrentWordIndex(0);
    }
  };

  return (
    <AIAssistantContext.Provider value={{
      isOpen,
      setIsOpen,
      activeTab,
      setActiveTab,
      openAssistantTab,
      learningContext,
      setLearningContext,
      clearLearningContext,
      explainCodeDraft,
      setExplainCodeDraft,
      explainLanguageDraft,
      setExplainLanguageDraft,
      readingText,
      setReadingText,
      isReading,
      isPaused,
      currentWordIndex,
      startReading,
      resumeReading,
      pauseReading,
      stopReading
    }}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
