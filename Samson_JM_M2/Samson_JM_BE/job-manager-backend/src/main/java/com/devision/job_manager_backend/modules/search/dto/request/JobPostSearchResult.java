package com.devision.job_manager_backend.modules.search.dto.request;

import lombok.Builder;
import lombok.Getter;   
import java.util.List;

@Builder
@Getter
public class JobPostSearchResult {
    private String jobPostId;
    private String title;
    private String companyName;
    private String location;
    private List<String> technicalSkills;
    private String employmentType;
    private Double salaryMin;
    private Double salaryMax;
}
