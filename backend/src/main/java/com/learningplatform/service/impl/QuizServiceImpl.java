package com.learningplatform.service.impl;

import com.learningplatform.exception.ResourceNotFoundException;
import com.learningplatform.model.entity.*;
import com.learningplatform.repository.QuizRepository;
import com.learningplatform.repository.QuizAttemptRepository;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;

    @Override
    public List<com.learningplatform.model.dto.QuizDTO> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public com.learningplatform.model.dto.QuizDTO getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        return mapToDTO(quiz);
    }

    @Override
    public List<Object> getQuizQuestions(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        
        List<Object> result = new ArrayList<>();
        for (Question question : quiz.getQuestions()) {
            Map<String, Object> q = new HashMap<>();
            q.put("id", question.getId());
            q.put("quizId", question.getQuiz().getId());
            q.put("questionText", question.getQuestionText());
            q.put("questionType", question.getQuestionType().name());
            q.put("points", question.getPoints());
            q.put("explanation", question.getExplanation());
            q.put("orderIndex", question.getOrderIndex());
            
            List<Map<String, Object>> answers = new ArrayList<>();
            for (Answer answer : question.getAnswers()) {
                Map<String, Object> a = new HashMap<>();
                a.put("id", answer.getId());
                a.put("questionId", answer.getQuestion().getId());
                a.put("answerText", answer.getAnswerText());
                a.put("isCorrect", answer.getIsCorrect());
                a.put("orderIndex", answer.getOrderIndex());
                answers.add(a);
            }
            q.put("answers", answers);
            result.add(q);
        }
        return result;
    }

    @Override
    @Transactional
    public QuizAttempt submitQuiz(Long quizId, Long userId, Map<Long, Long> answers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        int totalPoints = 0;
        int earnedPoints = 0;

        for (Question question : quiz.getQuestions()) {
            totalPoints += question.getPoints();
            Long selectedAnswerId = answers.get(question.getId());
            
            if (selectedAnswerId != null) {
                for (Answer answer : question.getAnswers()) {
                    if (answer.getId().equals(selectedAnswerId) && answer.getIsCorrect()) {
                        earnedPoints += question.getPoints();
                        break;
                    }
                }
            }
        }

        double score = quiz.getQuestions().size() > 0 
            ? (double) earnedPoints / totalPoints * 100 
            : 0;
        boolean passed = score >= quiz.getPassingScore();

        Map<String, Object> answersMap = new HashMap<>();
        answers.forEach((k, v) -> answersMap.put(k.toString(), v));

        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .quiz(quiz)
                .score(BigDecimal.valueOf(score))
                .totalPoints(totalPoints)
                .earnedPoints(earnedPoints)
                .passed(passed)
                .answers(answersMap)
                .startedAt(LocalDateTime.now().minusMinutes(quiz.getTimeLimitMinutes() != null ? quiz.getTimeLimitMinutes() : 0))
                .completedAt(LocalDateTime.now())
                .build();

        return quizAttemptRepository.save(attempt);
    }

    @Override
    public QuizAttempt getQuizResult(Long attemptId) {
        return quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));
    }

    @Override
    public List<QuizAttempt> getUserQuizAttempts(Long userId, Long quizId) {
        return quizAttemptRepository.findByUserIdAndQuizId(userId, quizId);
    }

    private com.learningplatform.model.dto.QuizDTO mapToDTO(Quiz quiz) {
        return com.learningplatform.model.dto.QuizDTO.builder()
                .id(quiz.getId())
                .courseId(quiz.getCourse().getId())
                .lessonId(quiz.getLesson() != null ? quiz.getLesson().getId() : null)
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .passingScore(quiz.getPassingScore())
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .shuffleQuestions(quiz.getShuffleQuestions())
                .showCorrectAnswers(quiz.getShowCorrectAnswers())
                .questionsCount(quiz.getQuestions().size())
                .build();
    }
}