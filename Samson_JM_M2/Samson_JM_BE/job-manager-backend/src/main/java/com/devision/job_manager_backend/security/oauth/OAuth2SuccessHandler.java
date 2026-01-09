package com.devision.job_manager_backend.security.oauth;

import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
import com.devision.job_manager_backend.modules.company.repository.CompanyRepository;
import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final CompanyAuthRepository companyAuthRepository;
    private final CompanyRepository companyRepository;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(
            CompanyAuthRepository companyAuthRepository,
            CompanyRepository companyRepository,
            JwtService jwtService
    ) {
        this.companyAuthRepository = companyAuthRepository;
        this.companyRepository = companyRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        CompanyAuth auth = companyAuthRepository.findByEmail(email)
            .orElseGet(() -> {
                CompanyAuth a = new CompanyAuth();
                a.setEmail(email);
                a.setRole("COMPANY");
                return companyAuthRepository.save(a);
            });

        boolean hasCompanyProfile =
            companyRepository.findByUserId(auth.getId()).isPresent();

        if (!hasCompanyProfile) {
            // ⛔ NO JWT YET
            response.sendRedirect(
                "http://localhost:3000/oauth/complete-profile?email=" + email
            );
            return;
        }

        // ✅ Only issue JWT if profile exists
        String token = jwtService.generateToken(
            auth.getId(),
            auth.getEmail(),
            auth.getRole()
        );

        response.sendRedirect(
            "http://localhost:3000/oauth/success?accessToken=" + token
        );
    }


}
