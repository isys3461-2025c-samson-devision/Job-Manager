package com.devision.job_manager_backend.modules.company.dto.response.applicant_side;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PublicCompanySummaryResponse {
    private String id;
    private String userId;
    private String companyName;
    private String logoUrl;
    private String city;
    private String country;
}
