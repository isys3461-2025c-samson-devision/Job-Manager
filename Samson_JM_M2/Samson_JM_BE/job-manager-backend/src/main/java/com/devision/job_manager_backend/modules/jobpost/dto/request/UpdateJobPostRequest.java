package com.devision.job_manager_backend.modules.jobpost.dto.request;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import com.devision.job_manager_backend.modules.jobpost.model.EmploymentType;
import com.devision.job_manager_backend.modules.jobpost.model.JobCategory;
import com.devision.job_manager_backend.modules.jobpost.model.SalaryType;

@Getter
@Setter
public class UpdateJobPostRequest {

    private String title;
    private String description;
    private String location;

    private EmploymentType employmentType;
    private List<JobCategory> categories;

    private LocalDate expiryDate;

    private SalaryType salaryType;
    private Double salaryMin;
    private Double salaryMax;

    private List<String> technicalSkills;

    private Boolean isPublished;
}
