package com.devision.job_manager_backend.modules.jobpost.dto.response;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JobPostApplicantResponse {
    private String applicationId;
    private String authId;          // applicant authId
    private String status;          // PENDING/...
    private String createdAt;

    private String cvUrl;
    private String coverLetterUrl; //
}