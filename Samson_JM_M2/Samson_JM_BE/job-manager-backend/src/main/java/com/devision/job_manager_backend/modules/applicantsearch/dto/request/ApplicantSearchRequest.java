package com.devision.job_manager_backend.modules.applicantsearch.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicantSearchRequest {

    private String keyword;
    private String locationType;
    private String locationValue;
    private String educationDegree;
    private String workExperience;
    private String workExperienceKeyword;
    private List<String> employmentTypes;
    private List<String> skillTags;
    private Double salaryMin;
    private Double salaryMax;
    private String jobId;
}
