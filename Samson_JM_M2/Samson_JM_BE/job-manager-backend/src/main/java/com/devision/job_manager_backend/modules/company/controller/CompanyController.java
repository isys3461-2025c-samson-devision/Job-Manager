package com.devision.job_manager_backend.modules.company.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.devision.job_manager_backend.modules.company.dto.request.UpdateCompanyRequest;
import com.devision.job_manager_backend.modules.company.dto.response.CompanyResponse;
import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.modules.company.service.CompanyService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyController {

    @GetMapping("/ping")
    public String ping() {
        return "COMPANY MODULE OK";
    }
    // get company me and put company me
    private final CompanyService companyService;

    @GetMapping("/me")
    public ResponseEntity<CompanyResponse> getMyCompany(
            Authentication authentication
    ) {
        String userId = authentication.getName();
        Company company = companyService.getOrCreateMyCompany(userId);
        return ResponseEntity.ok(toResponse(company));
    }

    @PatchMapping("/me")
    public ResponseEntity<CompanyResponse> updateMyCompany(
            Authentication authentication,
            @RequestBody UpdateCompanyRequest request
    ){
        String userId = authentication.getName();
        Company company = companyService.updateCompany(userId, request);
        return ResponseEntity.ok(toResponse(company));
    }
    private CompanyResponse toResponse(Company company) {
        return CompanyResponse.builder()
            .id(company.getId())
            .userId(company.getUserId())
            .companyName(company.getCompanyName())
            .email(company.getEmail())
            .phoneNumber(company.getPhoneNumber())
            .street(company.getStreet())
            .city(company.getCity())
            .country(company.getCountry())
            .aboutUs(company.getAboutUs())
            .whoWeAreLookingFor(company.getWhoWeAreLookingFor())
            .logoUrl(company.getLogoUrl())
            .skillsNeeded(company.getSkillsNeeded())
            .achievements(company.getAchievements())
            .mediaUrls(company.getMediaUrls())
            .build();
    }
}
