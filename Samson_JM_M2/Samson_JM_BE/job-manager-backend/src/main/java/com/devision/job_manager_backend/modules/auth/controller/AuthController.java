package com.devision.job_manager_backend.modules.auth.controller;

import com.devision.job_manager_backend.modules.auth.DTO.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.DTO.request.OAuthCompleteRequest;
import com.devision.job_manager_backend.modules.auth.DTO.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.DTO.response.AuthResponse;
import com.devision.job_manager_backend.modules.auth.service.internal.AuthInternalService;
import jakarta.validation.Valid;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthInternalService authService;

    @PostMapping("/oauth/complete-profile")
    public ResponseEntity<?> completeOAuth(
            @RequestBody OAuthCompleteRequest request
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

}