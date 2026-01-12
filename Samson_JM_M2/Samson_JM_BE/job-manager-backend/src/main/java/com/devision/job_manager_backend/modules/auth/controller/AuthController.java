package com.devision.job_manager_backend.modules.auth.controller;

import com.devision.job_manager_backend.modules.auth.dto.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.dto.request.OAuthCompleteRequest;
import com.devision.job_manager_backend.modules.auth.dto.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.dto.response.AuthResponse;
import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import com.devision.job_manager_backend.modules.auth.model.EmailVerificationToken;
import com.devision.job_manager_backend.modules.auth.service.internal.AuthInternalService;
import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.modules.company.repository.CompanyRepository;
import com.devision.job_manager_backend.modules.auth.repository.EmailVerificationTokenRepository;
import jakarta.validation.Valid;

import java.time.Instant;
import java.util.Map;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final CompanyAuthRepository companyAuthRepository;
    private final CompanyRepository companyRepository;
    private final AuthInternalService authService;

    @PostMapping("/oauth/complete-profile")
    public ResponseEntity<?> completeOAuth(
           @Valid @RequestBody OAuthCompleteRequest request
    ) {
        return ResponseEntity.ok(authService.completeOAuthRegistration(request));
    }


    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        authService.registerCompany(request);
        return ResponseEntity.ok(
            Map.of("message", "Registered successfully")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        // 1️⃣ Load token DOCUMENT from DB
        EmailVerificationToken verificationToken =
            emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid or expired verification token"
                ));

        // 2️⃣ Check expiration
        if (verificationToken.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Verification token expired"
            );
        }

        // 3️⃣ Activate auth account
        CompanyAuth auth = companyAuthRepository
            .findById(verificationToken.getCompanyAuthId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Auth account not found"
            ));

        auth.setActivated(true);
        companyAuthRepository.save(auth);

        // 4️⃣ CREATE company profile (THIS FIXES YOUR LOGIN ERROR)
        Company company = new Company();
        company.setUserId(auth.getId());
        company.setEmail(auth.getEmail());
        company.setCompanyName(auth.getCompanyName());
        company.setCountry(auth.getCountry());
        company.setPhoneNumber(auth.getPhoneNumber());
        company.setIsActivated(true);

        companyRepository.save(company);

        // 5️⃣ Delete token (one-time use)
        emailVerificationTokenRepository.delete(verificationToken);

        return ResponseEntity.ok(
            Map.of("message", "Email verified successfully")
        );
    }



}