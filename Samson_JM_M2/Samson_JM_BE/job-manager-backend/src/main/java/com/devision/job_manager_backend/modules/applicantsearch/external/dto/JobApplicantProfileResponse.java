package com.devision.job_manager_backend.modules.applicantsearch.external.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobApplicantProfileResponse {

    private boolean success;
    private List<JobApplicantProfile> data;
}
