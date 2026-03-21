package com.learningplatform.service.impl;

import com.learningplatform.exception.ResourceNotFoundException;
import com.learningplatform.model.entity.*;
import com.learningplatform.model.enums.ProgressStatus;
import com.learningplatform.repository.*;
import com.learningplatform.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final UserProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ExerciseAttemptRepository attemptRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public List<UserProgress> getUserProgress(Long userId) {
        return progressRepository.findByUserId(userId);
    }

    @Override
    public List<UserProgress> getCourseProgress(Long userId, Long courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId);
    }

    @Override
    @Transactional
    public UserProgress markLessonComplete(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        
        Course course = lesson.getCourse();

        // Check if progress already exists
        var existingProgress = progressRepository.findByUserIdAndLessonId(userId, lessonId);
        
        if (existingProgress.isPresent()) {
            UserProgress progress = existingProgress.get();
            progress.setStatus(ProgressStatus.COMPLETED);
            progress.setCompletionPercentage(BigDecimal.valueOf(100));
            progress.setCompletedAt(LocalDateTime.now());
            return progressRepository.save(progress);
        }

        // Create new progress
        UserProgress progress = UserProgress.builder()
                .user(user)
                .course(course)
                .lesson(lesson)
                .status(ProgressStatus.COMPLETED)
                .completionPercentage(BigDecimal.valueOf(100))
                .completedAt(LocalDateTime.now())
                .build();

        UserProgress saved = progressRepository.save(progress);
        
        // Update course completion percentage
        updateCourseCompletion(userId, course.getId());
        
        // Check if course is complete and generate certificate
        checkAndGenerateCertificate(userId, course.getId());

        return saved;
    }

    @Override
    public Map<String, Object> getUserStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Course progress
        List<UserProgress> allProgress = progressRepository.findByUserId(userId);
        long completedLessons = allProgress.stream()
                .filter(p -> p.getStatus() == ProgressStatus.COMPLETED)
                .count();
        
        stats.put("totalLessonsCompleted", completedLessons);
        stats.put("totalTimeSpent", allProgress.stream()
                .mapToInt(p -> p.getTimeSpentMinutes() != null ? p.getTimeSpentMinutes() : 0)
                .sum());
        
        // Exercise stats
        Long correctExercises = attemptRepository.countCorrectByUserId(userId);
        Long totalPoints = attemptRepository.sumPointsByUserId(userId);
        
        stats.put("exercisesCompleted", correctExercises != null ? correctExercises : 0);
        stats.put("totalPoints", totalPoints != null ? totalPoints : 0);
        
        // Quiz stats
        Long passedQuizzes = quizAttemptRepository.countPassedByUserId(userId);
        Double avgQuizScore = quizAttemptRepository.getAverageScoreByUserId(userId);
        
        stats.put("quizzesPassed", passedQuizzes != null ? passedQuizzes : 0);
        stats.put("averageQuizScore", avgQuizScore != null ? avgQuizScore : 0);
        
        // Certificates
        List<Certificate> certificates = certificateRepository.findByUserId(userId);
        stats.put("certificatesEarned", certificates.size());
        
        return stats;
    }

    private void updateCourseCompletion(Long userId, Long courseId) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        List<UserProgress> courseProgress = progressRepository.findByUserIdAndCourseId(userId, courseId);
        
        long completedLessons = courseProgress.stream()
                .filter(p -> p.getStatus() == ProgressStatus.COMPLETED)
                .count();
        
        int totalLessons = lessons.size();
        if (totalLessons > 0) {
            int percentage = (int) ((completedLessons * 100) / totalLessons);
            
            // Update enrollment
            enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                    .ifPresent(enrollment -> {
                        enrollment.setCompletionPercentage(BigDecimal.valueOf(percentage));
                        if (percentage == 100) {
                            enrollment.setCompletedAt(LocalDateTime.now());
                        }
                        enrollmentRepository.save(enrollment);
                    });
        }
    }

    private void checkAndGenerateCertificate(Long userId, Long courseId) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        List<UserProgress> courseProgress = progressRepository.findByUserIdAndCourseId(userId, courseId);
        
        long completedLessons = courseProgress.stream()
                .filter(p -> p.getStatus() == ProgressStatus.COMPLETED)
                .count();
        
        // If all lessons complete and no certificate yet
        if (completedLessons == lessons.size() && 
            !certificateRepository.existsByUserIdAndCourseId(userId, courseId)) {
            
            User user = userRepository.findById(userId).orElse(null);
            Course course = courseRepository.findById(courseId).orElse(null);
            
            if (user != null && course != null) {
                Certificate certificate = Certificate.builder()
                        .user(user)
                        .course(course)
                        .certificateCode(generateCertificateCode())
                        .recipientName(user.getFirstName() != null ? 
                                user.getFirstName() + " " + user.getLastName() : 
                                user.getUsername())
                        .courseName(course.getTitle())
                        .issuedDate(LocalDateTime.now())
                        .build();
                
                certificateRepository.save(certificate);
            }
        }
    }

    private String generateCertificateCode() {
        return "CERT-" + System.currentTimeMillis() + "-" + 
               (int) (Math.random() * 10000);
    }
}
