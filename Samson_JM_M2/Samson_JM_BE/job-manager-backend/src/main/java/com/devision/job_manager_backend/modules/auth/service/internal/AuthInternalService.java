package com.devision.job_manager_backend.modules.auth.service.internal;

import com.devision.job_manager_backend.modules.auth.dto.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.dto.request.OAuthCompleteRequest;
import com.devision.job_manager_backend.modules.auth.dto.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.dto.response.AuthResponse;

public interface AuthInternalService {

    Object completeOAuthRegistration(OAuthCompleteRequest request);

    void registerCompany(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
