package com.devision.job_manager_backend.modules.auth.service.internal;

import com.devision.job_manager_backend.modules.auth.DTO.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.DTO.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.DTO.response.LoginResponse;

public interface AuthInternalService {

    void registerCompany(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
