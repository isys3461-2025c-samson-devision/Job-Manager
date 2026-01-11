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
public class JobPostSummaryResponse {

    private String id;
    private String title;
    private String location;
    private String description;

    private String companyId;
    private String companyName;

    private EmploymentType employmentType;
    private List<JobCategory> categories;

    private SalaryType salaryType;
    private Double salaryMin;
    private Double salaryMax;

    private LocalDate expiryDate;
    private LocalDate postedDate;
    private Boolean isPublished;
    private List<String> technicalSkills;

    public JobPostSummaryResponse(
            String companyId,
            String companyName,
            String id,
            String title,
            String description,
            String location,
            EmploymentType employmentType,
            List<JobCategory> categories,
            SalaryType salaryType,
            Double salaryMin,
            Double salaryMax,
            List<String> technicalSkills,
            LocalDate expiryDate,
            LocalDate postedDate,
            Boolean isPublished
    ) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.employmentType = employmentType;
        this.categories = categories;
        this.salaryType = salaryType;
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.technicalSkills = technicalSkills;
        this.expiryDate = expiryDate;
        this.postedDate = postedDate;
        this.isPublished = isPublished;
    }
}
