package com.devision.job_manager_backend.security.oauth;

import com.devision.job_manager_backend.modules.auth.repository.CompanyAuthRepository;
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
    private final JwtService jwtService;

    public OAuth2SuccessHandler(
            CompanyAuthRepository companyAuthRepository,
            JwtService jwtService
    ) {
        this.companyAuthRepository = companyAuthRepository;
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

        var existing = companyAuthRepository.findByEmail(email);

        if (existing.isPresent()) {
            String token = jwtService.generateToken(
                    existing.get().getId(),
                    existing.get().getRole() // ✅ String, NO .name()
            );

            response.sendRedirect(
                    "http://localhost:3000/oauth/success?token=" + token
            );
        } else {
            response.sendRedirect(
                    "http://localhost:3000/oauth/complete-profile?email=" + email
            );
        }
    }
}
