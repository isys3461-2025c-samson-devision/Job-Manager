package com.devision.job_manager_backend.modules.applicantsearch.dto.response;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApplicantSearchProfileResponse {

    private String id;
    private List<String> technicalBackground;
    private List<String> employmentStatuses;
    private String country;
    private Double salaryMin;
    private Double salaryMax;
    private String highestEducationDegree;
    private Instant updatedAt;
}
