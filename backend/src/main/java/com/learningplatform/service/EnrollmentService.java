package com.learningplatform.service;

import com.learningplatform.model.entity.Certificate;
import com.learningplatform.model.entity.Enrollment;

import java.util.List;

public interface EnrollmentService {
    
    Enrollment enroll(Long userId, Long courseId);
    
    List<Enrollment> getUserEnrollments(Long userId);
    
    boolean isEnrolled(Long userId, Long courseId);
}
