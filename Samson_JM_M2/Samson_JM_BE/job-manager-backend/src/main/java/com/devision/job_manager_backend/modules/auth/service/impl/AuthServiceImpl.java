package com.devision.job_manager_backend.modules.auth.service.impl;

import com.devision.job_manager_backend.modules.auth.DTO.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.DTO.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.DTO.response.LoginResponse;
import com.devision.job_manager_backend.modules.auth.service.internal.AuthInternalService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthInternalService {

    @Override
    public void registerCompany(RegisterRequest request) {
        // TODO: implement real registration logic
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // TEMP: return dummy response so controller works
        return new LoginResponse("DUMMY_TOKEN", "COMPANY");
    }
}
