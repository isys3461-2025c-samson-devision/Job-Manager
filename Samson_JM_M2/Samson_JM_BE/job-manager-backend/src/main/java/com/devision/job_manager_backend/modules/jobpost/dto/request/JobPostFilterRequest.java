package com.devision.job_manager_backend.modules.jobpost.dto.request;

import java.util.List; 

import lombok.Getter;
import lombok.Setter;
import com.devision.job_manager_backend.modules.jobpost.model.EmploymentType;
import com.devision.job_manager_backend.modules.jobpost.model.JobCategory;
import com.devision.job_manager_backend.modules.jobpost.model.SalaryType;

@Getter
@Setter
public class JobPostFilterRequest {

    private String keyword;
    private String location;

    private EmploymentType employmentType;
    private List<JobCategory> categories;

    private SalaryType salaryType;
    private Double minSalary;
    private Double maxSalary;

    private List<String> technicalSkills;
}

