package com.devision.job_manager_backend.modules.applicantsearch.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicantSearchProfileRequest {
    @NotBlank
    private String technicalBackground;

    private List<String> technicalBackgroundTags;

    @NotEmpty
    private List<String> employmentStatuses;

    @NotBlank
    private String country;

    private Integer salaryMin;

    private Integer salaryMax;

    @NotBlank
    private String highestEducationDegree;
}
