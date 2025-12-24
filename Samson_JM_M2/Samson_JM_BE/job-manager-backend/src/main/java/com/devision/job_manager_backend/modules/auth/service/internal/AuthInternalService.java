package com.devision.job_manager_backend.modules.auth.service.internal;

import com.devision.job_manager_backend.modules.auth.DTO.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.DTO.request.OAuthCompleteRequest;
import com.devision.job_manager_backend.modules.auth.DTO.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.DTO.response.AuthResponse;

public interface AuthInternalService {

    Object completeOAuthRegistration(OAuthCompleteRequest request);

    void registerCompany(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
