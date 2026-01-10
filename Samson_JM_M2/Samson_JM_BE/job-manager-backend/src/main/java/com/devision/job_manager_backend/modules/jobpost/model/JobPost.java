package com.devision.job_manager_backend.modules.jobpost.model;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Document(collection = "job_posts")
@Getter
@Setter
@NoArgsConstructor
public class JobPost {

    @Id
    private String id;

    private boolean fresher_flag;

    /** Ownership */
    private String companyId;

    /** Core info */
    private String title;
    private String description;
    private String location;

    /** Employment */
    private EmploymentType employmentType;   // Full-time OR Part-time

    private List<JobCategory> categories;     // Internship + Contract allowed

    /** Dates */
    private LocalDate postedDate;
    private LocalDate expiryDate;

    /** Salary */
    private SalaryType salaryType;
    private Double salaryMin;
    private Double salaryMax;

    /** Tags */
    private List<String> technicalSkills;

    /** Visibility */
    private Boolean isPublished;

    //private List<applicantFiles> applicantRecords;
}
