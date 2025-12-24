package com.devision.job_manager_backend.modules.jobpost.model;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "jobposts")
@Getter
@Setter
public class JobpostModel {
    @Id
    private String Id;
    private String companyId;
    private String title;
    private String description;
    private LocalDate postedDate;
    private String location;// change into map obj later
    private String skillTag;
    @NotNull
    @Field(targetType = FieldType.STRING)
    private List<EmploymentType> employmentType;// make it either full time or parst time
    @NotNull
    @Field(targetType = FieldType.STRING)
    private SalaryType salaryType;
    private Double salaryAmountMin;// default to salary threshold
    private Double salaryAmountMax;
    private Boolean isPublished;// private or public
    private List<String> pendingApplication; // processing
    private List<String> archivedApplication;// accepted

    public JobpostModel(String companyId, String title, String description, LocalDate postedDate, String location,
            String skillTag, List<EmploymentType> employmentType, SalaryType salaryType, Double salaryAmountMin,
            Double salaryAmountMax, Boolean isPublished, List<String> pendingApplication, List<String> archivedApplication) {
        
        for (EmploymentType type : employmentType) {
            if (type.equals(EmploymentType.FULL_TIME) && type.equals(EmploymentType.PART_TIME)) { // fulltime or parttime. throw error if both
                throw new IllegalArgumentException("Invalid employment type: " + type);
            }
        }
        this.companyId = companyId;
        this.title = title;
        this.description = description;
        this.postedDate = postedDate;
        this.location = location;
        this.skillTag = skillTag;
        this.salaryType = salaryType;
        this.salaryAmountMin = salaryAmountMin;
        this.salaryAmountMax = salaryAmountMax;
        this.isPublished = isPublished;
        this.pendingApplication = pendingApplication;
        this.archivedApplication = archivedApplication;
    }
}
