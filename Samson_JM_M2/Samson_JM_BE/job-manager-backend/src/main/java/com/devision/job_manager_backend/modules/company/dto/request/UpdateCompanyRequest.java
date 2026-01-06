package com.devision.job_manager_backend.modules.company.dto.request;

import java.util.List;
import com.devision.job_manager_backend.modules.company.model.CompanyMediaItem;
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
    private List<String> skillsNeeded;
    private List<String> achievements;
    private List<String> mediaUrls;
}
