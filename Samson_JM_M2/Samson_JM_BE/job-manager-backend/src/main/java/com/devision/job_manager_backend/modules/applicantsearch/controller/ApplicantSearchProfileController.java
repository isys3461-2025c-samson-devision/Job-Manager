package com.devision.job_manager_backend.modules.applicantsearch.controller;

import com.devision.job_manager_backend.modules.applicantsearch.DTO.request.ApplicantSearchProfileRequest;
import com.devision.job_manager_backend.modules.applicantsearch.DTO.response.ApplicantSearchProfileResponse;
import com.devision.job_manager_backend.modules.applicantsearch.service.ApplicantSearchProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applicant-search-profile")
@RequiredArgsConstructor
public class ApplicantSearchProfileController {
    private final ApplicantSearchProfileService profileService;

    @GetMapping
    public ResponseEntity<ApplicantSearchProfileResponse> getProfile() {
        String companyId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        return profileService.getProfile(companyId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApplicantSearchProfileResponse> saveProfile(
        @Valid @RequestBody ApplicantSearchProfileRequest request
    ) {
        String companyId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();

        return ResponseEntity.ok(profileService.saveProfile(companyId, request));
    }
}
