package com.devision.job_manager_backend.modules.applicantsearch.model;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "applicant_search_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantSearchProfile {

    @Id
    private String id;

    private String ownerId;

    private List<String> technicalBackground;
    private List<String> employmentStatuses;
    private String country;
    private Double salaryMin;
    private Double salaryMax;
    private String highestEducationDegree;

    private Instant createdAt;
    private Instant updatedAt;
}
