package com.devision.job_manager_backend.modules.applicantsearch.DTO.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApplicantSearchProfileResponse {
    private String id;
    private String technicalBackground;
    private List<String> technicalBackgroundTags;
    private List<String> employmentStatuses;
    private String country;
    private Integer salaryMin;
    private Integer salaryMax;
    private String highestEducationDegree;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
