package com.devision.job_manager_backend.modules.applicantsearch.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "applicant_search_profile")
@Getter
@Setter
public class ApplicantSearchProfile {
    @Id
    private String id;
    private String companyId;
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
