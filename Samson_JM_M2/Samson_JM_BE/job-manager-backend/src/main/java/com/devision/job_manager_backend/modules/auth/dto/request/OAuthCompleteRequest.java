package com.devision.job_manager_backend.modules.auth.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OAuthCompleteRequest {

    private String email;
    private String companyName;
    private String country;
    private String phoneNumber;
}
