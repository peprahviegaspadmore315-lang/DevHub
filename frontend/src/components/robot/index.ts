import React from 'react'

export const RobotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children)
}

export const useQuizRobot = () => {
  return {
    onQuizStart: () => {},
    onCorrectAnswer: () => {},
    onWrongAnswer: (feedback?: string) => {},
    onQuizComplete: (result?: { score: number; passed: boolean; totalQuestions: number; correctAnswers: number }) => {},
  }
}

export const useLessonRobot = (lesson?: any) => {
  return {
    readLesson: () => {
      if (lesson?.content) {
        // placeholder for audio or TTS in future
        console.log('Reading lesson:', lesson.title)
      }
    },
    onLessonStart: () => {},
    onLessonProgress: () => {},
    onLessonComplete: () => {},
  }
}
