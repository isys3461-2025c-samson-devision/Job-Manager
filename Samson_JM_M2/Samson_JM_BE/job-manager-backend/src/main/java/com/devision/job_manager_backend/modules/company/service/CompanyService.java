package com.devision.job_manager_backend.modules.company.service;

import java.time.Instant;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
import com.devision.job_manager_backend.modules.auth.service.external.AuthExternalService;
import com.devision.job_manager_backend.modules.company.dto.request.UpdateCompanyRequest;
import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.modules.company.repository.CompanyRepository;
import com.devision.job_manager_backend.modules.jobpost.repository.JobPostRepository;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final AuthExternalService authExternalService;
    private final JobPostRepository jobPostRepository;

    private final CompanyAuthRepository companyAuthRepository;
    private final PasswordEncoder passwordEncoder;

    public Company getOrCreateMyCompany(String userId) {

        return companyRepository.findByUserId(userId)
            .orElseGet(() -> {

                CompanyAuth auth = authExternalService
                    .getAuthByUserId(userId)
                    .orElseThrow(() ->
                        new RuntimeException("User must complete company profile")
                    );

                Instant now = Instant.now();

                Company company = Company.builder()
                    .userId(userId)
                    .email(auth.getEmail())
                    .companyName(auth.getCompanyName())
                    .phoneNumber(auth.getPhoneNumber())
                    .country(auth.getCountry())
                    .createdAt(now)
                    .updatedAt(now)
                    .build();

                return companyRepository.save(company);
            });
    }

    public Company updateCompany(String userId, UpdateCompanyRequest request) {

        Company company = companyRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Company not found"));

        String oldEmail = company.getEmail();

        boolean needAuthUpdate =
            (request.getEmail() != null && !request.getEmail().equals(oldEmail)) ||
            (request.getPassword() != null && !request.getPassword().isBlank());

        if (request.getCompanyName() != null) {
            company.setCompanyName(request.getCompanyName());

            jobPostRepository.updateCompanyNameByCompanyId(
                userId,
                request.getCompanyName()
            );
        }


        if (needAuthUpdate) {
            CompanyAuth auth = companyAuthRepository.findByEmail(oldEmail)
                .orElseGet(() -> authExternalService.getAuthByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Auth not found")));

            if (request.getEmail() != null && !request.getEmail().equals(oldEmail)) {
                if (companyAuthRepository.existsByEmail(request.getEmail())) {
                    throw new RuntimeException("Email already in use");
                }
                auth.setEmail(request.getEmail());
                company.setEmail(request.getEmail());
            }

            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                auth.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            }

            companyAuthRepository.save(auth);
        }

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
        if (request.getSkillsNeeded() != null)
            company.setSkillsNeeded(request.getSkillsNeeded());
        if (request.getAchievements() != null)
            company.setAchievements(request.getAchievements());
        if (request.getMediaUrls() != null)
            company.setMediaUrls(request.getMediaUrls());

        company.setUpdatedAt(Instant.now());
        return companyRepository.save(company);
    }
}
