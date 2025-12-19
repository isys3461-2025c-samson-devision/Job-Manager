package com.devision.job_manager_backend.modules.auth.controller;

import com.devision.job_manager_backend.modules.auth.dto.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.dto.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.dto.response.AuthResponse;
import com.devision.job_manager_backend.modules.auth.service.internal.AuthInternalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthInternalService authService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        authService.registerCompany(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

}