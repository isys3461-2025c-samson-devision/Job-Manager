package samson.backend.dev.auth.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import samson.backend.dev.auth.dto.LoginRequest;
import samson.backend.dev.auth.dto.LoginResponse;

import samson.backend.dev.auth.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        authService.authenticate(request.getEmail(), request.getPassword());
        return new LoginResponse("Login successful");
    }
}