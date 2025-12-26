package com.devision.job_manager_backend.config;

import com.devision.job_manager_backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
            // PUBLIC endpoints
            // ✅ AUTH endpoints
            .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()

            // ✅ COMPANY endpoints
            // Public profile is open
            .requestMatchers(HttpMethod.GET, "/api/companies/*/public").permitAll()

            // "me" endpoints must be COMPANY only
            .requestMatchers(HttpMethod.GET, "/api/companies/me").hasRole("COMPANY")
            .requestMatchers(HttpMethod.PATCH, "/api/companies/me").hasRole("COMPANY")
            .requestMatchers(HttpMethod.PUT, "/api/companies/me").hasRole("COMPANY")

            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Everything else
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
