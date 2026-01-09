package com.devision.job_manager_backend.modules.auth.service.impl;

import com.devision.job_manager_backend.modules.auth.dto.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.dto.request.OAuthCompleteRequest;
import com.devision.job_manager_backend.modules.auth.dto.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.dto.response.AuthResponse;
import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import java.util.Map;
import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
import com.devision.job_manager_backend.modules.auth.service.internal.AuthInternalService;
import com.devision.job_manager_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthInternalService {

    private final CompanyAuthRepository companyAuthRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // ✅ INJECTED

    @Override
    public void registerCompany(RegisterRequest request) {

        if (companyAuthRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        CompanyAuth auth = new CompanyAuth();
        auth.setCompanyName(request.getCompanyName());
        auth.setEmail(request.getEmail());
        auth.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        auth.setRole("COMPANY");

        auth.setPhoneNumber(request.getPhoneNumber());
        auth.setCountry(request.getCountry());

        companyAuthRepository.save(auth);
    }


    @Override
    public AuthResponse login(LoginRequest request) {

        CompanyAuth auth = companyAuthRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        boolean matches = passwordEncoder.matches(
                request.getPassword(),
                auth.getPasswordHash()
        );

        if (!matches) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(auth.getId(), auth.getEmail(), auth.getRole());

        return new AuthResponse(token, auth.getRole(), auth.getCompanyName());
    }

    @Override
    public AuthResponse completeOAuthRegistration(OAuthCompleteRequest request) {

        CompanyAuth auth = companyAuthRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("OAuth account not found"));

        // ✅ Update existing OAuth account
        auth.setCompanyName(request.getCompanyName());
        auth.setCountry(request.getCountry());
        auth.setPhoneNumber(request.getPhoneNumber());

        CompanyAuth saved = companyAuthRepository.save(auth);

        String token = jwtService.generateToken(
                saved.getId(),
                saved.getEmail(),
                saved.getRole()
        );

        return new AuthResponse(token, saved.getRole(), saved.getCompanyName());
    }



}
