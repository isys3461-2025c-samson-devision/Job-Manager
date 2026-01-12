package com.devision.job_manager_backend.modules.search.dto.request;

import java.util.List;
import lombok.Builder;
import lombok.Getter;   

@Builder
@Getter
public class CompanySearchResult {
    private String companyId;
    private String companyName;
    private String city;
    private String country;
    private List<String> skillsNeeded;
}
