package com.learningplatform.service;

import com.learningplatform.model.dto.ExerciseRequest;
import com.learningplatform.model.entity.Exercise;
import com.learningplatform.model.entity.ExerciseAttempt;

import java.util.List;

public interface ExerciseService {
    
    List<Exercise> getAllExercises();
    
    List<Exercise> getExercisesByCourse(Long courseId);
    
    List<Exercise> getExercisesByLesson(Long lessonId);
    
    Exercise getExerciseById(Long id);
    
    Exercise createExercise(ExerciseRequest request);
    
    Exercise updateExercise(Long id, ExerciseRequest request);
    
    void deleteExercise(Long id);
    
    ExerciseAttempt submitSolution(Long exerciseId, String userCode, Long userId);
    
    String getSolution(Long exerciseId);
    
    List<String> getHints(Long exerciseId);
}
