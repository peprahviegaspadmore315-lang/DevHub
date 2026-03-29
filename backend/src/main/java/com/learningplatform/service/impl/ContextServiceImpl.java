package com.learningplatform.service.impl;

import com.learningplatform.model.entity.Lesson;
import com.learningplatform.model.entity.UserProgress;
import com.learningplatform.model.entity.User;
import com.learningplatform.repository.LessonRepository;
import com.learningplatform.repository.UserProgressRepository;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.service.ContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContextServiceImpl implements ContextService {

    private final UserRepository userRepository;
    private final UserProgressRepository progressRepository;
    private final LessonRepository lessonRepository;

    @Override
    public Map<String, Object> getContext(Long userId) {
        Map<String, Object> context = new HashMap<>();
        
        // Get user information
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            context.put("userId", user.getId());
            context.put("username", user.getUsername());
            context.put("email", user.getEmail());
        }

        // Get user progress information - get the most recent progress entry
        List<UserProgress> progressList = progressRepository.findByUserId(userId);
        if (progressList != null && !progressList.isEmpty()) {
            // Sort by lastAccessedAt descending to get the most recent
            progressList.sort((p1, p2) -> {
                LocalDateTime time1 = p1.getLastAccessedAt() != null ? p1.getLastAccessedAt() : LocalDateTime.MIN;
                LocalDateTime time2 = p2.getLastAccessedAt() != null ? p2.getLastAccessedAt() : LocalDateTime.MIN;
                return time2.compareTo(time1); // descending
            });
            UserProgress progress = progressList.get(0);
            context.put("lastAccessedAt", progress.getLastAccessedAt());
            context.put("completionPercentage", progress.getCompletionPercentage());
            context.put("lessonId", progress.getLesson() != null ? progress.getLesson().getId() : null);
            
            // Get current lesson details if available
            if (progress.getLesson() != null) {
                Lesson lesson = progress.getLesson();
                context.put("topic", lesson.getTitle()); // Using title as topic
                context.put("language", "javascript"); // Default, would need to be stored elsewhere
                context.put("lessonTitle", lesson.getTitle());
                context.put("lessonDescription", lesson.getContent());
            }
        }
        
        // Add some default values if no progress found
        if (!context.containsKey("skillLevel")) {
            context.put("skillLevel", "beginner");
        }
        if (!context.containsKey("topic")) {
            context.put("topic", "general programming");
        }
        if (!context.containsKey("language")) {
            context.put("language", "javascript");
        }
        
        return context;
    }
}