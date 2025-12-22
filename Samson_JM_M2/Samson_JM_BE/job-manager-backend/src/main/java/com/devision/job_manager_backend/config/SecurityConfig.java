package com.devision.job_manager_backend.config;

import com.devision.job_manager_backend.security.JwtAuthenticationFilter;
import com.devision.job_manager_backend.security.oauth.OAuth2SuccessHandler;
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
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(
        JwtAuthenticationFilter jwtFilter,
        OAuth2SuccessHandler oAuth2SuccessHandler
    ) {
        this.jwtFilter = jwtFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
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

                // PUBLIC
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ADMIN ONLY
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // COMPANY ONLY
                .requestMatchers("/api/company/**").hasRole("COMPANY")

                // DENY EVERYTHING ELSE
                .anyRequest().denyAll()
            )
            .oauth2Login(oauth -> oauth 
                .successHandler(oAuth2SuccessHandler)
                .failureUrl("/oauth2/error")

            )

            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
