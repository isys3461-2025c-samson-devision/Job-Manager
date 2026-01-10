package com.devision.job_manager_backend.modules.applicantsearch.dto.request;

import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicantSearchProfileRequest {

    @JsonDeserialize(using = CommaSeparatedListDeserializer.class)
    private List<String> technicalBackground;

    @JsonDeserialize(using = CommaSeparatedListDeserializer.class)
    private List<String> employmentStatuses;
    private String country;
    private Double salaryMin;
    private Double salaryMax;
    private String highestEducationDegree;
}