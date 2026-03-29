package com.learningplatform.controller;

import com.learningplatform.model.dto.CourseDTO;
import com.learningplatform.model.dto.PlatformSummaryDTO;
import com.learningplatform.model.entity.Course;
import com.learningplatform.model.entity.User;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.EnrollmentRepository;
import com.learningplatform.repository.ExerciseRepository;
import com.learningplatform.repository.LessonRepository;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final ExerciseRepository exerciseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "orderIndex") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        
        List<Course> courses = courseRepository.findByIsPublishedTrue(pageable).toList();
        
        List<CourseDTO> courseDTOs = courses.stream()
                .map(this::mapToDTO)
                .toList();
        
        return ResponseEntity.ok(courseDTOs);
    }

    @GetMapping("/summary")
    public ResponseEntity<PlatformSummaryDTO> getPlatformSummary() {
        PlatformSummaryDTO summary = PlatformSummaryDTO.builder()
                .courses(courseRepository.countByIsPublishedTrue())
                .tutorials(lessonRepository.countByIsPublishedTrue())
                .exercises(exerciseRepository.countByIsPublishedTrue())
                .users(userRepository.countByIsActiveTrue())
                .build();

        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new com.learningplatform.exception.ResourceNotFoundException("Course not found"));
        return ResponseEntity.ok(mapToDTO(course));
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<CourseDTO> getCourseBySlug(@PathVariable String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new com.learningplatform.exception.ResourceNotFoundException("Course not found"));
        return ResponseEntity.ok(mapToDTO(course));
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<CourseDTO>> getFeaturedCourses() {
        List<Course> courses = courseRepository.findByIsFeaturedTrueAndIsPublishedTrue();
        return ResponseEntity.ok(courses.stream().map(this::mapToDTO).toList());
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(courseRepository.findAllCategories());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseDTO> createCourse(
            @RequestBody CourseDTO courseDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = authService.getCurrentUser(userDetails.getUsername());
        
        Course course = Course.builder()
                .title(courseDTO.getTitle())
                .slug(courseDTO.getSlug())
                .description(courseDTO.getDescription())
                .longDescription(courseDTO.getLongDescription())
                .category(courseDTO.getCategory())
                .difficulty(courseDTO.getDifficulty())
                .iconUrl(courseDTO.getIconUrl())
                .bannerUrl(courseDTO.getBannerUrl())
                .isPremium(courseDTO.getIsPremium())
                .price(courseDTO.getPrice())
                .estimatedHours(courseDTO.getEstimatedHours())
                .orderIndex(courseDTO.getOrderIndex())
                .isPublished(courseDTO.getIsPublished())
                .isFeatured(courseDTO.getIsFeatured())
                .createdBy(user)
                .build();
        
        course = courseRepository.save(course);
        return ResponseEntity.ok(mapToDTO(course));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseDTO> updateCourse(
            @PathVariable Long id,
            @RequestBody CourseDTO courseDTO) {
        
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new com.learningplatform.exception.ResourceNotFoundException("Course not found"));
        
        course.setTitle(courseDTO.getTitle());
        course.setSlug(courseDTO.getSlug());
        course.setDescription(courseDTO.getDescription());
        course.setLongDescription(courseDTO.getLongDescription());
        course.setCategory(courseDTO.getCategory());
        course.setDifficulty(courseDTO.getDifficulty());
        course.setIconUrl(courseDTO.getIconUrl());
        course.setBannerUrl(courseDTO.getBannerUrl());
        course.setIsPremium(courseDTO.getIsPremium());
        course.setPrice(courseDTO.getPrice());
        course.setEstimatedHours(courseDTO.getEstimatedHours());
        course.setOrderIndex(courseDTO.getOrderIndex());
        course.setIsPublished(courseDTO.getIsPublished());
        course.setIsFeatured(courseDTO.getIsFeatured());
        
        course = courseRepository.save(course);
        return ResponseEntity.ok(mapToDTO(course));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    private CourseDTO mapToDTO(Course course) {
        Long lessonsCount = lessonRepository.countByCourseIdAndIsPublishedTrue(course.getId());
        Long exercisesCount = exerciseRepository.countByCourseIdAndIsPublishedTrue(course.getId());
        
        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .slug(course.getSlug())
                .description(course.getDescription())
                .longDescription(course.getLongDescription())
                .category(course.getCategory())
                .difficulty(course.getDifficulty())
                .iconUrl(course.getIconUrl())
                .bannerUrl(course.getBannerUrl())
                .isPremium(course.getIsPremium())
                .price(course.getPrice())
                .estimatedHours(course.getEstimatedHours())
                .orderIndex(course.getOrderIndex())
                .isPublished(course.getIsPublished())
                .isFeatured(course.getIsFeatured())
                .createdBy(course.getCreatedBy() != null ? course.getCreatedBy().getId() : null)
                .createdByName(course.getCreatedBy() != null ? course.getCreatedBy().getUsername() : null)
                .lessonsCount(lessonsCount.intValue())
                .exercisesCount(exercisesCount.intValue())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
