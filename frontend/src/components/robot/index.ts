// Context
export { RobotProvider, useRobot, useRobotStateInfo, useRobotActions } from './context';

// Hooks
export { 
  useRobotState, 
  analyzeContent,
  useSpeechSynthesis, 
  useTypingDetection, 
  analyzeMessage,
  useLessonRobot,
  useQuizRobot,
} from './hooks';

// Components
export { 
  ChatBox, 
  RobotAvatar, 
  RobotControls, 
  RobotAssistant 
} from './components';

// Types
export type { 
  RobotState, 
  RobotEvent, 
  RobotContextValue, 
  SpeakOptions, 
  ChatMessage,
  RobotConfig 
} from './types';
