package com.devision.job_manager_backend.modules.company.service;

import java.time.Instant;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import com.devision.job_manager_backend.modules.auth.service.external.AuthExternalService;
import com.devision.job_manager_backend.modules.company.dto.request.UpdateCompanyRequest;
import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.modules.company.repository.CompanyRepository;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final AuthExternalService authExternalService;

    /**
     * Get current user's company profile.
     * Auto-create if it does not exist.
     */
    public Company getOrCreateMyCompany(String userId) {
    return companyRepository.findByUserId(userId)
        .orElseGet(() -> {
            CompanyAuth auth = authExternalService.getAuthByUserId(userId);
            Instant now = Instant.now();

            Company company = Company.builder()
                .userId(userId)
                .email(auth.getEmail())
                .companyName(auth.getCompanyName())          // ✅ FIX
                .phoneNumber(auth.getPhoneNumber())         // ✅ FIX
                .country(auth.getCountry())
                .createdAt(now)
                .updatedAt(now)
                .build();

            return companyRepository.save(company);
        });
    }

    /**
     * Update company profile
     */
        public Company updateCompany(
            String userId,
            UpdateCompanyRequest request
    ) {
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (request.getCompanyName() != null)
            company.setCompanyName(request.getCompanyName());

        if (request.getPhoneNumber() != null)
            company.setPhoneNumber(request.getPhoneNumber());

        if (request.getStreet() != null)
            company.setStreet(request.getStreet());

        if (request.getCity() != null)
            company.setCity(request.getCity());

        if (request.getCountry() != null)
            company.setCountry(request.getCountry());

        if (request.getAboutUs() != null)
            company.setAboutUs(request.getAboutUs());

        if (request.getWhoWeAreLookingFor() != null)
            company.setWhoWeAreLookingFor(request.getWhoWeAreLookingFor());

        if (request.getLogoUrl() != null)
            company.setLogoUrl(request.getLogoUrl());

        company.setUpdatedAt(Instant.now());

        return companyRepository.save(company);
    }

}
