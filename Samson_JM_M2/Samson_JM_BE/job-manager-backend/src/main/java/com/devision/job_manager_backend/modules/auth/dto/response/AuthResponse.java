package com.devision.job_manager_backend.modules.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String role;
    private String companyName;

}


