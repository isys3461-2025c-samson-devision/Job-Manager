package com.devision.job_manager_backend.modules.jobpost.dto.response;

import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

import com.devision.job_manager_backend.modules.jobpost.model.EmploymentType;
import com.devision.job_manager_backend.modules.jobpost.model.JobCategory;
import com.devision.job_manager_backend.modules.jobpost.model.SalaryType;

@Getter
@AllArgsConstructor
public class JobPostDetailResponse {

    private String id;
    private String companyId;
    private String companyName;

    private String title;
    private String description;
    private String location;

    private EmploymentType employmentType;
    private List<JobCategory> categories;

    private LocalDate postedDate;
    private LocalDate expiryDate;

    private SalaryType salaryType;
    private Double salaryMin;
    private Double salaryMax;

    private List<String> technicalSkills;

    private Boolean isPublished;
}

