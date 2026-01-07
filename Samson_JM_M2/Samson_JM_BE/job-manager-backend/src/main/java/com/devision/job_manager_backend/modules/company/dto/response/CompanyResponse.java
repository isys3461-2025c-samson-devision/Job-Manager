package com.devision.job_manager_backend.modules.company.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CompanyResponse {

    private String companyName;
    private String email;
    private String phoneNumber;
    private String street;
    private String city;
    private String country;

    private String aboutUs;
    private String whoWeAreLookingFor;

    private String logoUrl;
}
