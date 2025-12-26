package com.devision.job_manager_backend.modules.company.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CompanyMedia {
    private String id;
    private String companyId;
    private String mediaType;
    private String mediaLabel;
    private String mediaUrl;
}
