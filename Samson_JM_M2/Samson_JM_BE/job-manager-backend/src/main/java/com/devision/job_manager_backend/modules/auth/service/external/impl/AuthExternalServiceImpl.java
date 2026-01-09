package com.devision.job_manager_backend.modules.auth.service.external.impl;

import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
import com.devision.job_manager_backend.modules.auth.service.external.AuthExternalService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthExternalServiceImpl implements AuthExternalService {

    private final CompanyAuthRepository companyAuthRepository;

    @Override
    public Optional<CompanyAuth> getAuthByUserId(String userId) {
        return companyAuthRepository.findById(userId);
    }

    @Override
    public String getEmailByUserId(String userId) {
        return companyAuthRepository.findById(userId)
                .map(CompanyAuth::getEmail)
                .orElse(null);
    }
}



