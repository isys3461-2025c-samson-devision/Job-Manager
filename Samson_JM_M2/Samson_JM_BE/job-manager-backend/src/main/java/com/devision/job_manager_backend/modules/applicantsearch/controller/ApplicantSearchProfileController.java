package com.devision.job_manager_backend.modules.applicantsearch.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devision.job_manager_backend.modules.applicantsearch.dto.request.ApplicantSearchProfileRequest;
import com.devision.job_manager_backend.modules.applicantsearch.dto.response.ApplicantSearchProfileResponse;
import com.devision.job_manager_backend.modules.applicantsearch.model.ApplicantSearchProfile;
import com.devision.job_manager_backend.modules.applicantsearch.service.ApplicantSearchProfileService;

@RestController
@RequestMapping("/api/applicant-search-profile")
@RequiredArgsConstructor
public class ApplicantSearchProfileController {

    private final ApplicantSearchProfileService applicantSearchProfileService;

    @GetMapping
    public ResponseEntity<ApplicantSearchProfileResponse> getProfile(
            Authentication authentication
    ) {
        String ownerId = authentication.getName();
        ApplicantSearchProfile profile = applicantSearchProfileService.getProfile(ownerId);

        if (profile == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(toResponse(profile));
    }

    @PostMapping
    public ResponseEntity<ApplicantSearchProfileResponse> saveProfile(
            Authentication authentication,
            @RequestBody ApplicantSearchProfileRequest request
    ) {
        String ownerId = authentication.getName();
        ApplicantSearchProfile profile =
                applicantSearchProfileService.saveProfile(ownerId, request);

        return ResponseEntity.ok(toResponse(profile));
    }

    private ApplicantSearchProfileResponse toResponse(ApplicantSearchProfile profile) {
        return new ApplicantSearchProfileResponse(
                profile.getId(),
                profile.getTechnicalBackground(),
                profile.getEmploymentStatuses(),
                profile.getCountry(),
                profile.getSalaryMin(),
                profile.getSalaryMax(),
                profile.getHighestEducationDegree(),
                profile.getUpdatedAt()
        );
    }
}
