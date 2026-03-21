import { useCallback, useEffect } from 'react';
import { useRobotActions } from '../context';

interface LessonContent {
  title?: string;
  content?: string;
  summary?: string;
}

export const useLessonRobot = (lesson: LessonContent | null) => {
  const { dispatch, speak, setState } = useRobotActions();

  const readLesson = useCallback(() => {
    if (!lesson) return;

    setState('reading');
    
    const text = [
      lesson.title && `Lesson: ${lesson.title}`,
      lesson.summary,
      lesson.content?.substring(0, 2000),
    ].filter(Boolean).join('. ');

    if (text) {
      speak(text, { forceReading: true });
    }
  }, [lesson, speak, setState]);

  const readParagraph = useCallback((paragraph: string) => {
    setState('reading');
    speak(paragraph, { forceReading: true });
  }, [speak, setState]);

  const readCodeExample = useCallback((code: string) => {
    setState('reading');
    // For code, we might want different handling
    speak(`Code example: ${code.substring(0, 500)}`, { forceReading: true });
  }, [speak, setState]);

  // Auto-read on lesson change
  useEffect(() => {
    if (lesson) {
      dispatch('LESSON_START');
    }
    return () => {
      dispatch('LESSON_END');
    };
  }, [lesson, dispatch]);

  return {
    readLesson,
    readParagraph,
    readCodeExample,
  };
};

export default useLessonRobot;
