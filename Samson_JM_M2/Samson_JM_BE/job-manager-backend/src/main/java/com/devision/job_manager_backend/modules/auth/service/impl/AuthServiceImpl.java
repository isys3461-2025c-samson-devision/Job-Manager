package com.devision.job_manager_backend.modules.auth.service.impl;

import com.devision.job_manager_backend.modules.auth.DTO.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.DTO.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.DTO.response.AuthResponse;
import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
import com.devision.job_manager_backend.modules.auth.service.internal.AuthInternalService;
import com.devision.job_manager_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthInternalService {

    private final CompanyAuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // ✅ INJECTED

    @Override
    public void registerCompany(RegisterRequest request) {

        if (authRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        CompanyAuth auth = new CompanyAuth();
        auth.setCompanyName(request.getCompanyName());
        auth.setEmail(request.getEmail());
        auth.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        auth.setRole("COMPANY");

        auth.setPhoneNumber(request.getPhoneNumber());
        auth.setCountry(request.getCountry());

        authRepository.save(auth);
    }


    @Override
    public AuthResponse login(LoginRequest request) {

        CompanyAuth auth = authRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        boolean matches = passwordEncoder.matches(
                request.getPassword(),
                auth.getPasswordHash()
        );

        if (!matches) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(auth.getId(), auth.getRole());

        return new AuthResponse(token, auth.getRole());
    }
}
