package com.learningplatform.controller;

import com.learningplatform.model.entity.QuizAttempt;
import com.learningplatform.service.AuthService;
import com.learningplatform.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<com.learningplatform.model.dto.QuizDTO>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.learningplatform.model.dto.QuizDTO> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<List<Object>> getQuizQuestions(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizQuestions(id));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<QuizAttempt> submitQuiz(
            @PathVariable Long id,
            @RequestBody Map<Long, Long> answers,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(quizService.submitQuiz(id, user.getId(), answers));
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<QuizAttempt> getQuizResults(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        List<QuizAttempt> attempts = quizService.getUserQuizAttempts(user.getId(), id);
        
        if (attempts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(attempts.get(attempts.size() - 1));
    }
}