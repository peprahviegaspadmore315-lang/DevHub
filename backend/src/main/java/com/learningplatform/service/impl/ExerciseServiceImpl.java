package com.learningplatform.service.impl;

import com.learningplatform.exception.ResourceNotFoundException;
import com.learningplatform.model.dto.ExerciseRequest;
import com.learningplatform.model.entity.*;
import com.learningplatform.repository.*;
import com.learningplatform.service.CodeExecutionService;
import com.learningplatform.service.ExerciseService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseAttemptRepository attemptRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final CodeExecutionService codeExecutionService;

    @Override
    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    @Override
    public List<Exercise> getExercisesByCourse(Long courseId) {
        return exerciseRepository.findByCourseIdAndIsPublishedTrueOrderByOrderIndexAsc(courseId);
    }

    @Override
    public List<Exercise> getExercisesByLesson(Long lessonId) {
        return exerciseRepository.findByLessonId(lessonId);
    }

    @Override
    public Exercise getExerciseById(Long id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
    }

    @Override
    @Transactional
    public Exercise createExercise(ExerciseRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Lesson lesson = null;
        if (request.getLessonId() != null) {
            lesson = lessonRepository.findById(request.getLessonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        }

        String hintsJson = "[]";
        if (request.getHints() != null) {
            try {
                hintsJson = new ObjectMapper().writeValueAsString(request.getHints());
            } catch (JsonProcessingException e) {
                hintsJson = "[]";
            }
        }

        String testCasesJson = "{}";
        if (request.getTestCases() != null) {
            try {
                testCasesJson = new ObjectMapper().writeValueAsString(request.getTestCases());
            } catch (JsonProcessingException e) {
                testCasesJson = "{}";
            }
        }

        Exercise exercise = Exercise.builder()
                .course(course)
                .lesson(lesson)
                .title(request.getTitle())
                .description(request.getDescription())
                .instructions(request.getInstructions())
                .type(request.getType() != null ? request.getType() : com.learningplatform.model.enums.ExerciseType.WRITE_CODE)
                .starterCode(request.getStarterCode())
                .solution(request.getSolution())
                .testCases(testCasesJson)
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : com.learningplatform.model.enums.Difficulty.BEGINNER)
                .points(request.getPoints() != null ? request.getPoints() : 10)
                .hints(hintsJson)
                .constraints(request.getConstraints())
                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0)
                .timeLimitSeconds(request.getTimeLimitSeconds() != null ? request.getTimeLimitSeconds() : 30)
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : false)
                .build();

        return exerciseRepository.save(exercise);
    }

    @Override
    @Transactional
    public Exercise updateExercise(Long id, ExerciseRequest request) {
        Exercise exercise = getExerciseById(id);

        if (request.getTitle() != null) exercise.setTitle(request.getTitle());
        if (request.getDescription() != null) exercise.setDescription(request.getDescription());
        if (request.getInstructions() != null) exercise.setInstructions(request.getInstructions());
        if (request.getType() != null) exercise.setType(request.getType());
        if (request.getStarterCode() != null) exercise.setStarterCode(request.getStarterCode());
        if (request.getSolution() != null) exercise.setSolution(request.getSolution());
        if (request.getTestCases() != null) {
            try {
                exercise.setTestCases(new ObjectMapper().writeValueAsString(request.getTestCases()));
            } catch (JsonProcessingException e) {
                exercise.setTestCases("{}");
            }
        }
        if (request.getDifficulty() != null) exercise.setDifficulty(request.getDifficulty());
        if (request.getPoints() != null) exercise.setPoints(request.getPoints());
        if (request.getHints() != null) {
            try {
                exercise.setHints(new ObjectMapper().writeValueAsString(request.getHints()));
            } catch (JsonProcessingException e) {
                exercise.setHints("[]");
            }
        }
        if (request.getConstraints() != null) exercise.setConstraints(request.getConstraints());
        if (request.getOrderIndex() != null) exercise.setOrderIndex(request.getOrderIndex());
        if (request.getTimeLimitSeconds() != null) exercise.setTimeLimitSeconds(request.getTimeLimitSeconds());
        if (request.getIsPublished() != null) exercise.setIsPublished(request.getIsPublished());

        return exerciseRepository.save(exercise);
    }

    @Override
    @Transactional
    public void deleteExercise(Long id) {
        exerciseRepository.deleteById(id);
    }

    @Override
    public ExerciseAttempt submitSolution(Long exerciseId, String userCode, Long userId) {
        Exercise exercise = getExerciseById(exerciseId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get attempt number
        Integer maxAttempt = attemptRepository.findMaxAttemptNumber(userId, exerciseId);
        int attemptNumber = (maxAttempt != null ? maxAttempt : 0) + 1;

        // Execute code
        com.learningplatform.model.dto.CodeRunRequest execRequest = 
                com.learningplatform.model.dto.CodeRunRequest.builder()
                        .language(mapExerciseTypeToLanguage(exercise.getType()))
                        .code(userCode)
                        .build();

        com.learningplatform.model.dto.CodeRunResponse response = 
                codeExecutionService.execute(execRequest);

        // Check if correct
        boolean isCorrect = response.isSuccess();

        ExerciseAttempt attempt = ExerciseAttempt.builder()
                .user(user)
                .exercise(exercise)
                .userCode(userCode)
                .isCorrect(isCorrect)
                .output(response.getOutput())
                .errorMessage(response.getError())
                .executionTimeMs(response.getExecutionTimeMs() != null ? response.getExecutionTimeMs().intValue() : 0)
                .memoryUsedKb(0) // Not available in new DTO
                .pointsEarned(isCorrect ? exercise.getPoints() : 0)
                .attemptNumber(attemptNumber)
                .submittedAt(LocalDateTime.now())
                .build();

        return attemptRepository.save(attempt);
    }

    @Override
    public String getSolution(Long exerciseId) {
        Exercise exercise = getExerciseById(exerciseId);
        return exercise.getSolution();
    }

    @Override
    public List<String> getHints(Long exerciseId) {
        Exercise exercise = getExerciseById(exerciseId);
        String hintsJson = exercise.getHints();
        if (hintsJson == null || hintsJson.isEmpty()) {
            return Arrays.asList();
        }
        try {
            return new ObjectMapper().readValue(hintsJson, List.class);
        } catch (Exception e) {
            // Fallback: split by comma if not JSON
            return Arrays.asList(hintsJson.split(","));
        }
    }

    private com.learningplatform.model.dto.CodeRunRequest.Language mapExerciseTypeToLanguage(
            com.learningplatform.model.enums.ExerciseType type) {
        if (type == null) return com.learningplatform.model.dto.CodeRunRequest.Language.JAVASCRIPT;
        return switch (type) {
            case WRITE_CODE, FIX_CODE, CODE_COMPLETION -> 
                    com.learningplatform.model.dto.CodeRunRequest.Language.JAVASCRIPT;
            default -> com.learningplatform.model.dto.CodeRunRequest.Language.JAVASCRIPT;
        };
    }
}