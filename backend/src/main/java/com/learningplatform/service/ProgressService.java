package com.learningplatform.service;

import com.learningplatform.model.entity.UserProgress;

import java.util.List;
import java.util.Map;

public interface ProgressService {
    
    List<UserProgress> getUserProgress(Long userId);
    
    List<UserProgress> getCourseProgress(Long userId, Long courseId);
    
    UserProgress markLessonComplete(Long userId, Long lessonId);
    
    Map<String, Object> getUserStats(Long userId);
}
