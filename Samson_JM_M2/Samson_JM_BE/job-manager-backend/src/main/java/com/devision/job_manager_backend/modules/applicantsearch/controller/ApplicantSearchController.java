package com.devision.job_manager_backend.modules.applicantsearch.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devision.job_manager_backend.modules.applicantsearch.dto.request.ApplicantSearchRequest;
import com.devision.job_manager_backend.modules.applicantsearch.dto.response.ApplicantSearchResult;
import com.devision.job_manager_backend.modules.applicantsearch.external.JobApplicantProfileClient;
import com.devision.job_manager_backend.modules.applicantsearch.external.dto.JobApplicantProfile;
import com.devision.job_manager_backend.modules.applicantsearch.service.ApplicantSearchService;

@RestController
@RequestMapping("/api/applicants")
@RequiredArgsConstructor
public class ApplicantSearchController {

    private final ApplicantSearchService applicantSearchService;

    private final JobApplicantProfileClient profileClient;

    @GetMapping
    public List<JobApplicantProfile> getApplicants() {
        return profileClient.fetchProfiles();
    }
    

    @PostMapping("/search")
    public ResponseEntity<List<ApplicantSearchResult>> searchApplicants(
            @RequestBody ApplicantSearchRequest request
    ) {
        List<ApplicantSearchResult> results = applicantSearchService.searchApplicants(request);
        return ResponseEntity.ok(results);
    }
}