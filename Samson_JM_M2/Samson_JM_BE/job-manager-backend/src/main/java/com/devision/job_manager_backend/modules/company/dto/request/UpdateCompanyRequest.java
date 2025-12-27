package com.devision.job_manager_backend.modules.company.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCompanyRequest {

    private String companyName;
    private String phoneNumber;
    private String street;
    private String city;
    private String country;

    private String aboutUs;
    private String whoWeAreLookingFor;

    private String logoUrl;
}
