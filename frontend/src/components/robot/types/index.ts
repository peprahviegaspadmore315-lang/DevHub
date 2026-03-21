export type RobotState = 
  | 'idle' 
  | 'reading' 
  | 'speaking' 
  | 'excited' 
  | 'thinking' 
  | 'confused' 
  | 'celebrating'
  | 'evaluating';

export type RobotEvent = 
  | 'TYPING_START'
  | 'TYPING_END'
  | 'MESSAGE_RECEIVED'
  | 'MESSAGE_SENT'
  | 'LESSON_START'
  | 'LESSON_END'
  | 'QUIZ_START'
  | 'QUIZ_CORRECT'
  | 'QUIZ_WRONG'
  | 'QUIZ_COMPLETE'
  | 'EVALUATION_START'
  | 'EVALUATION_GOOD'
  | 'EVALUATION_BAD'
  | 'ERROR'
  | 'IDLE'
  | 'THINKING';

export interface RobotContextValue {
  state: RobotState;
  isTyping: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  setState: React.Dispatch<React.SetStateAction<RobotState>>;
  dispatch: (event: RobotEvent, payload?: unknown) => void;
  speak: (text: string, options?: SpeakOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export interface SpeakOptions {
  forceReading?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface RobotConfig {
  voiceURI?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  autoSpeak?: boolean;
}
