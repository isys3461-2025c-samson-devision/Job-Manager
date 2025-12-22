package com.devision.job_manager_backend.modules.auth.seed;

import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
@RequiredArgsConstructor
public class AdminSeeder {

    private final CompanyAuthRepository companyAuthRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seedAdmin() {

        boolean adminExists = companyAuthRepository.existsByRole("ADMIN");
        if (adminExists) return;

        CompanyAuth admin = new CompanyAuth();
        admin.setCompanyName("DEVision Admin");
        admin.setEmail("admin@devision.com");
        admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
        admin.setCountry("System");
        admin.setPhoneNumber("N/A");
        admin.setRole("ADMIN");

        companyAuthRepository.save(admin);

        System.out.println("✅ ADMIN account seeded: admin@devision.com");
    }
}
