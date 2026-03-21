package com.learningplatform.controller;

import com.learningplatform.model.dto.ExerciseRequest;
import com.learningplatform.model.entity.Exercise;
import com.learningplatform.model.entity.ExerciseAttempt;
import com.learningplatform.service.AuthService;
import com.learningplatform.service.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long lessonId) {
        
        if (courseId != null) {
            return ResponseEntity.ok(exerciseService.getExercisesByCourse(courseId));
        } else if (lessonId != null) {
            return ResponseEntity.ok(exerciseService.getExercisesByLesson(lessonId));
        }
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercise> getExerciseById(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.getExerciseById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<Exercise> createExercise(@Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(exerciseService.createExercise(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id, @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(exerciseService.updateExercise(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ExerciseAttempt> submitSolution(
            @PathVariable Long id,
            @RequestBody SubmitSolutionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(exerciseService.submitSolution(id, request.getCode(), user.getId()));
    }

    @GetMapping("/{id}/solution")
    public ResponseEntity<String> getSolution(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.getSolution(id));
    }

    @GetMapping("/{id}/hints")
    public ResponseEntity<List<String>> getHints(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.getHints(id));
    }

    public static class SubmitSolutionRequest {
        private String code;
        
        public SubmitSolutionRequest() {}
        
        public SubmitSolutionRequest(String code) {
            this.code = code;
        }
        
        public String getCode() {
            return code;
        }
        
        public void setCode(String code) {
            this.code = code;
        }
    }
}
