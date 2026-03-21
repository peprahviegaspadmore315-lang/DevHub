package com.learningplatform.service;

import com.learningplatform.model.entity.Certificate;

import java.util.List;

public interface CertificateService {
    
    List<Certificate> getUserCertificates(Long userId);
    
    Certificate getCertificateById(Long id);
    
    Certificate verifyCertificate(String code);
}
