package com.learningplatform.controller;

import com.learningplatform.exception.ResourceNotFoundException;
import com.learningplatform.model.dto.LessonDTO;
import com.learningplatform.model.entity.Course;
import com.learningplatform.model.entity.Lesson;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {
    
    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    
    @GetMapping("/{id}")
    public ResponseEntity<LessonDTO> getLessonById(@PathVariable Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        return ResponseEntity.ok(mapToDTO(lesson));
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonDTO>> getLessonsByCourse(@PathVariable Long courseId) {
        List<Lesson> lessons = lessonRepository.findByCourseIdAndIsPublishedTrueOrderByOrderIndexAsc(courseId);
        return ResponseEntity.ok(lessons.stream().map(this::mapToDTO).toList());
    }
    
    @GetMapping("/course/{courseId}/slug/{slug}")
    public ResponseEntity<LessonDTO> getLessonBySlug(@PathVariable Long courseId, @PathVariable String slug) {
        Lesson lesson = lessonRepository.findByCourseIdAndSlug(courseId, slug)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        return ResponseEntity.ok(mapToDTO(lesson));
    }
    
    @GetMapping("/course/{courseId}/next/{currentLessonId}")
    public ResponseEntity<LessonDTO> getNextLesson(@PathVariable Long courseId, @PathVariable Long currentLessonId) {
        Lesson currentLesson = lessonRepository.findById(currentLessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        
        return lessonRepository.findNextLesson(courseId, currentLesson.getOrderIndex())
                .map(lesson -> ResponseEntity.ok(mapToDTO(lesson)))
                .orElse(ResponseEntity.noContent().build());
    }
    
    @GetMapping("/course/{courseId}/previous/{currentLessonId}")
    public ResponseEntity<LessonDTO> getPreviousLesson(@PathVariable Long courseId, @PathVariable Long currentLessonId) {
        Lesson currentLesson = lessonRepository.findById(currentLessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        
        return lessonRepository.findPreviousLesson(courseId, currentLesson.getOrderIndex())
                .map(lesson -> ResponseEntity.ok(mapToDTO(lesson)))
                .orElse(ResponseEntity.noContent().build());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<LessonDTO> createLesson(@RequestBody LessonDTO lessonDTO) {
        Course course = courseRepository.findById(lessonDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        
        Lesson lesson = Lesson.builder()
                .course(course)
                .title(lessonDTO.getTitle())
                .slug(lessonDTO.getSlug())
                .content(lessonDTO.getContent())
                .contentHtml(lessonDTO.getContentHtml())
                .codeExample(lessonDTO.getCodeExample())
                .videoUrl(lessonDTO.getVideoUrl())
                .orderIndex(lessonDTO.getOrderIndex())
                .estimatedMinutes(lessonDTO.getEstimatedMinutes())
                .isPublished(lessonDTO.getIsPublished())
                .isPremium(lessonDTO.getIsPremium())
                .build();
        
        lesson = lessonRepository.save(lesson);
        return ResponseEntity.ok(mapToDTO(lesson));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<LessonDTO> updateLesson(@PathVariable Long id, @RequestBody LessonDTO lessonDTO) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        
        lesson.setTitle(lessonDTO.getTitle());
        lesson.setSlug(lessonDTO.getSlug());
        lesson.setContent(lessonDTO.getContent());
        lesson.setContentHtml(lessonDTO.getContentHtml());
        lesson.setCodeExample(lessonDTO.getCodeExample());
        lesson.setVideoUrl(lessonDTO.getVideoUrl());
        lesson.setOrderIndex(lessonDTO.getOrderIndex());
        lesson.setEstimatedMinutes(lessonDTO.getEstimatedMinutes());
        lesson.setIsPublished(lessonDTO.getIsPublished());
        lesson.setIsPremium(lessonDTO.getIsPremium());
        
        lesson = lessonRepository.save(lesson);
        return ResponseEntity.ok(mapToDTO(lesson));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    private LessonDTO mapToDTO(Lesson lesson) {
        Course course = lesson.getCourse();
        
        Boolean hasNext = lessonRepository.findNextLesson(course.getId(), lesson.getOrderIndex()).isPresent();
        Boolean hasPrevious = lessonRepository.findPreviousLesson(course.getId(), lesson.getOrderIndex()).isPresent();
        
        Long nextLessonId = lessonRepository.findNextLesson(course.getId(), lesson.getOrderIndex())
                .map(Lesson::getId).orElse(null);
        Long previousLessonId = lessonRepository.findPreviousLesson(course.getId(), lesson.getOrderIndex())
                .map(Lesson::getId).orElse(null);
        
        return LessonDTO.builder()
                .id(lesson.getId())
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .title(lesson.getTitle())
                .slug(lesson.getSlug())
                .content(lesson.getContent())
                .contentHtml(lesson.getContentHtml())
                .codeExample(lesson.getCodeExample())
                .videoUrl(lesson.getVideoUrl())
                .orderIndex(lesson.getOrderIndex())
                .estimatedMinutes(lesson.getEstimatedMinutes())
                .isPublished(lesson.getIsPublished())
                .isPremium(lesson.getIsPremium())
                .hasNext(hasNext)
                .hasPrevious(hasPrevious)
                .nextLessonId(nextLessonId)
                .previousLessonId(previousLessonId)
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}
