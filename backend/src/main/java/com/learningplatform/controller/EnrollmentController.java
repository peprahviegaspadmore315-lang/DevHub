package com.learningplatform.controller;

import com.learningplatform.model.entity.Certificate;
import com.learningplatform.model.entity.Enrollment;
import com.learningplatform.service.AuthService;
import com.learningplatform.service.CertificateService;
import com.learningplatform.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final CertificateService certificateService;
    private final AuthService authService;

    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<Enrollment> enrollInCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(enrollmentService.enroll(user.getId(), courseId));
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<Enrollment>> getUserEnrollments(@AuthenticationPrincipal UserDetails userDetails) {
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(enrollmentService.getUserEnrollments(user.getId()));
    }

    @GetMapping("/courses/{courseId}/enrolled")
    public ResponseEntity<Boolean> checkEnrollment(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(enrollmentService.isEnrolled(user.getId(), courseId));
    }

    @GetMapping("/certificates")
    public ResponseEntity<List<Certificate>> getUserCertificates(@AuthenticationPrincipal UserDetails userDetails) {
        var user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(certificateService.getUserCertificates(user.getId()));
    }

    @GetMapping("/certificates/{id}")
    public ResponseEntity<Certificate> getCertificate(@PathVariable Long id) {
        return ResponseEntity.ok(certificateService.getCertificateById(id));
    }

    @GetMapping("/certificates/verify/{code}")
    public ResponseEntity<Certificate> verifyCertificate(@PathVariable String code) {
        return ResponseEntity.ok(certificateService.verifyCertificate(code));
    }
}
