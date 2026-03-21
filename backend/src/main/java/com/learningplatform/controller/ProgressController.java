package com.learningplatform.controller;

import com.learningplatform.model.entity.UserProgress;
import com.learningplatform.service.AuthService;
import com.learningplatform.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<UserProgress>> getUserProgress(@AuthenticationPrincipal UserDetails userDetails) {
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(progressService.getUserProgress(user.getId()));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<UserProgress>> getCourseProgress(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(progressService.getCourseProgress(user.getId(), courseId));
    }

    @PostMapping("/lesson/{lessonId}/complete")
    public ResponseEntity<UserProgress> markLessonComplete(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(progressService.markLessonComplete(user.getId(), lessonId));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(@AuthenticationPrincipal UserDetails userDetails) {
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(progressService.getUserStats(user.getId()));
    }
}
