package samson.backend.dev.auth.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import samson.backend.dev.auth.model.AuthModel;
import samson.backend.dev.auth.repository.AuthRepository;

@Service
public class AuthService {
    private final AuthRepository repo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthModel authenticate(String email, String rawPassword) {
        AuthModel user = repo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }
}
