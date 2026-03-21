package com.learningplatform.repository;

import com.learningplatform.model.entity.Certificate;
import com.learningplatform.model.enums.CertificateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    
    List<Certificate> findByUserId(Long userId);
    
    Optional<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);
    
    Optional<Certificate> findByCertificateCode(String certificateCode);
    
    List<Certificate> findByUserIdAndStatus(Long userId, CertificateStatus status);
    
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    
    @Query("SELECT c FROM Certificate c WHERE c.certificateCode = :code AND c.status = 'ACTIVE'")
    Optional<Certificate> findActiveByCertificateCode(String code);
}
