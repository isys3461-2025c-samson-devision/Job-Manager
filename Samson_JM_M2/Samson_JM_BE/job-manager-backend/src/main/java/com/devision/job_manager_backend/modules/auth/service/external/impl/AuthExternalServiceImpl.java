package com.devision.job_manager_backend.modules.auth.service.external.impl;

import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
import com.devision.job_manager_backend.modules.auth.service.external.AuthExternalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthExternalServiceImpl implements AuthExternalService {
    private final CompanyAuthRepository companyAuthRepository;

    @Override
    public String getCompanyEmail(String companyId) {
        return companyAuthRepository.findById(companyId)
            .map(auth -> auth.getEmail())
            .orElse(null);
    }
}
