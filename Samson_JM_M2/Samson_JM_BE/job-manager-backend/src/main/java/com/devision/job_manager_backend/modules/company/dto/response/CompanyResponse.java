package com.devision.job_manager_backend.modules.company.dto.response;

import java.util.List;
import com.devision.job_manager_backend.modules.company.model.CompanyMediaItem;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CompanyResponse {
    private String id;
    private String userId;
    private String companyName;
    private String email;
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
