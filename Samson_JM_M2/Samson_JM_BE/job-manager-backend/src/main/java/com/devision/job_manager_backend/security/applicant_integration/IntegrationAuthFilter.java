package com.devision.job_manager_backend.security.applicant_integration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class IntegrationAuthFilter extends OncePerRequestFilter {

    @Value("${integration.x-api-key}")
    private String apiKey;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Only protect integration APIs
        if (!request.getRequestURI().startsWith("/api/integration")) {
            filterChain.doFilter(request, response);
            return;
        }

        String requestKey = request.getHeader("X-API-KEY");

        if (requestKey == null || !requestKey.equals(apiKey)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Invalid or missing API Key");
            System.out.println("REQ = [" + requestKey + "]");
            System.out.println("CFG = [" + apiKey + "]");
            return;
        }

        


        filterChain.doFilter(request, response);
    }
}
