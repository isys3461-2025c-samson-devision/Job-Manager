package com.devision.job_manager_backend.modules.auth.service.impl;

import com.devision.job_manager_backend.modules.auth.dto.request.LoginRequest;
import com.devision.job_manager_backend.modules.auth.dto.request.OAuthCompleteRequest;
import com.devision.job_manager_backend.modules.auth.dto.request.RegisterRequest;
import com.devision.job_manager_backend.modules.auth.dto.response.AuthResponse;
import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import com.devision.job_manager_backend.modules.auth.model.EmailVerificationToken;
import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
import com.devision.job_manager_backend.modules.auth.service.external.EmailService;
import com.devision.job_manager_backend.modules.auth.service.internal.AuthInternalService;
import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.modules.company.repository.CompanyRepository;
import com.devision.job_manager_backend.modules.auth.repository.EmailVerificationTokenRepository;
import com.devision.job_manager_backend.security.JwtService;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthInternalService {

    private final CompanyAuthRepository companyAuthRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final EmailService emailService;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // ✅ INJECTED

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final Duration FAIL_WINDOW = Duration.ofSeconds(60);

    @Override
    public void registerCompany(RegisterRequest request) {

        String token = UUID.randomUUID().toString();

        if (companyAuthRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        CompanyAuth auth = new CompanyAuth();
        auth.setCompanyName(request.getCompanyName());
        auth.setEmail(request.getEmail());
        auth.setCountry(request.getCountry());
        auth.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        auth.setRole("COMPANY");

        auth.setPhoneNumber(request.getPhoneNumber());
        auth.setCountry(request.getCountry());

        auth.setActivated(false);
        auth.setCreatedAt(Instant.now());

        auth.setFailedLoginCount(0);
        auth.setFirstFailedAt(null);
        auth.setLockUntil(null);

        companyAuthRepository.save(auth);

        emailVerificationTokenRepository.save(
            new EmailVerificationToken(
                null,
                token,
                auth.getId(),
                auth.getEmail(),
                Instant.now().plus(24, ChronoUnit.HOURS)
            )
        );
        
        emailService.sendVerificationEmail(auth.getEmail(), token);


    }

    @Override
    public AuthResponse login(LoginRequest request) {

        CompanyAuth auth = companyAuthRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        Company company = companyRepository.findByUserId(auth.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found"));

        if (!Boolean.TRUE.equals(company.getIsActivated())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Company account is deactivated"
            );
        }

        if (!auth.isActivated()) {
            throw new RuntimeException(
                "Please verify your email before logging in"
            );
        }


        Instant now = Instant.now();

        if (isLocked(auth, now)) {
            long remaining = Math.max(0, Duration.between(now, auth.getLockUntil()).getSeconds());
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Your account is locked until " + auth.getLockUntil() + " (" + remaining + "s remaining)."
            );
        }

        boolean matches = passwordEncoder.matches(
                request.getPassword(),
                auth.getPasswordHash()
        );

        if (!matches) {
            registerFailedAttempt(auth, now);
            companyAuthRepository.save(auth);

            int count = auth.getFailedLoginCount() == null ? 0 : auth.getFailedLoginCount();
            Instant first = auth.getFirstFailedAt();
            long windowLeft = 0;
            if (first != null) {
                long used = Duration.between(first, now).getSeconds();
                windowLeft = Math.max(0, FAIL_WINDOW.getSeconds() - used);
            }

            if (auth.getLockUntil() != null && auth.getLockUntil().isAfter(now)) {
                long remaining = Math.max(0, Duration.between(now, auth.getLockUntil()).getSeconds());
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Your account is locked until " + auth.getLockUntil() + " (" + remaining + "s remaining)."
                );
            }

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials. Attempt " + count + "/" + MAX_FAILED_ATTEMPTS + ". Window resets in " + windowLeft + "s."
            );
        }

        resetFailedAttempts(auth);
        companyAuthRepository.save(auth);

        String token = jwtService.generateToken(auth.getId(), auth.getEmail(), auth.getRole());
        return new AuthResponse(token, auth.getRole());
    }

    @Override
    public AuthResponse completeOAuthRegistration(OAuthCompleteRequest request) {

        CompanyAuth auth = companyAuthRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("OAuth account not found"));

        if (companyRepository.findByUserId(auth.getId()).isPresent()) {
            throw new RuntimeException("Company profile already exists");
        }

        String systemPassword = java.util.UUID.randomUUID().toString();
        String passwordHash = passwordEncoder.encode(systemPassword);

        auth.setCompanyName(request.getCompanyName());
        auth.setCountry(request.getCountry());
        auth.setPhoneNumber(request.getPhoneNumber());
        auth.setPasswordHash(passwordHash);

        companyAuthRepository.save(auth);

        Company company = new Company();
        company.setUserId(auth.getId());
        company.setEmail(auth.getEmail());
        company.setCompanyName(request.getCompanyName());
        company.setCountry(request.getCountry());
        company.setPhoneNumber(request.getPhoneNumber());

        companyRepository.save(company);

        String accessToken = jwtService.generateToken(
                auth.getId(),
                auth.getEmail(),
                auth.getRole()
        );

        return new AuthResponse(
                accessToken,
                auth.getRole()
        );
    }

    private boolean isLocked(CompanyAuth auth, Instant now) {
        return auth.getLockUntil() != null && auth.getLockUntil().isAfter(now);
    }

    private void resetFailedAttempts(CompanyAuth auth) {
        auth.setFailedLoginCount(0);
        auth.setFirstFailedAt(null);
        auth.setLockUntil(null);
    }

    private void registerFailedAttempt(CompanyAuth auth, Instant now) {
        Integer currentCount = auth.getFailedLoginCount();
        if (currentCount == null) currentCount = 0;

        Instant firstFailedAt = auth.getFirstFailedAt();

        boolean windowExpired =
                firstFailedAt == null || Duration.between(firstFailedAt, now).compareTo(FAIL_WINDOW) > 0;

        if (windowExpired) {
            auth.setFirstFailedAt(now);
            auth.setFailedLoginCount(1);
            auth.setLockUntil(null);
            return;
        }

        int newCount = currentCount + 1;
        auth.setFailedLoginCount(newCount);

        if (newCount >= MAX_FAILED_ATTEMPTS) {
            auth.setLockUntil(firstFailedAt.plus(FAIL_WINDOW));
        }
    }
}
