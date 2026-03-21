import { useCallback } from 'react';
import { useRobotActions } from '../context';

interface QuizQuestion {
  questionText?: string;
  question_type?: string;
}

interface QuizResult {
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
}

export const useQuizRobot = () => {
  const { dispatch, speak, setState } = useRobotActions();

  const onQuizStart = useCallback(() => {
    setState('thinking');
    speak("Let's start the quiz! I'll be here to help. Read each question carefully.");
  }, [speak, setState]);

  const onQuestionRead = useCallback((question: QuizQuestion) => {
    if (question.questionText) {
      setState('reading');
      speak(question.questionText);
    }
  }, [speak, setState]);

  const onCorrectAnswer = useCallback((explanation?: string) => {
    const message = explanation 
      ? `Correct! ${explanation}`
      : "That's correct! Great job!";
    
    dispatch('QUIZ_CORRECT', message);
    speak(message);
  }, [dispatch, speak]);

  const onWrongAnswer = useCallback((correctAnswer?: string) => {
    const message = correctAnswer
      ? `Not quite. The correct answer was: ${correctAnswer}`
      : "That's not right. Don't worry, keep trying!";
    
    dispatch('QUIZ_WRONG');
    speak(message);
  }, [dispatch, speak]);

  const onQuizComplete = useCallback((result: QuizResult) => {
    dispatch('QUIZ_COMPLETE');
    
    let message: string;
    if (result.passed) {
      message = `Congratulations! You scored ${result.score}%. You passed with ${result.correctAnswers} out of ${result.totalQuestions} correct answers!`;
    } else {
      message = `You scored ${result.score}%. Keep practicing! You need ${result.correctAnswers} more correct answers to pass.`;
    }
    
    speak(message);
  }, [dispatch, speak]);

  return {
    onQuizStart,
    onQuestionRead,
    onCorrectAnswer,
    onWrongAnswer,
    onQuizComplete,
  };
};

export default useQuizRobot;
