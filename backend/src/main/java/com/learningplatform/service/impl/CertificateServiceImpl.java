package com.learningplatform.service.impl;

import com.learningplatform.exception.ResourceNotFoundException;
import com.learningplatform.model.entity.Certificate;
import com.learningplatform.repository.CertificateRepository;
import com.learningplatform.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;

    @Override
    public List<Certificate> getUserCertificates(Long userId) {
        return certificateRepository.findByUserId(userId);
    }

    @Override
    public Certificate getCertificateById(Long id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
    }

    @Override
    public Certificate verifyCertificate(String code) {
        return certificateRepository.findActiveByCertificateCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found or invalid"));
    }
}
