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
import org.springframework.core.annotation.Order;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtFilter;
  private final OAuth2SuccessHandler oAuth2SuccessHandler;

  public SecurityConfig(JwtAuthenticationFilter jwtFilter, OAuth2SuccessHandler oAuth2SuccessHandler) {
    this.jwtFilter = jwtFilter;
    this.oAuth2SuccessHandler = oAuth2SuccessHandler;
  }

  @Bean
  @Order(1)
  public SecurityFilterChain apiChain(HttpSecurity http) throws Exception {
    http
      .securityMatcher("/api/**")
      .csrf(csrf -> csrf.disable())
      .cors(cors -> {})
      .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .exceptionHandling(e -> e.authenticationEntryPoint((req, res, ex) -> {
        res.setStatus(401);
        res.setContentType("application/json");
        res.getWriter().write("{\"message\":\"Unauthorized\"}");
      }))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/api/payments/webhook/**").permitAll()
        .requestMatchers("/api/companies/**").permitAll()
        .requestMatchers("/api/jobposts/**").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .requestMatchers("/api/company/**").hasRole("COMPANY")
        .requestMatchers("/api/subscriptions/**").authenticated()
        .anyRequest().authenticated()
      )
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
      .httpBasic(b -> b.disable());

    return http.build();
  }

  @Bean
  @Order(2)
  public SecurityFilterChain webChain(HttpSecurity http) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .cors(cors -> {})
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/oauth2/**", "/oauth2/authorization/**", "/login/**").permitAll()
        .anyRequest().authenticated()
      )
      .oauth2Login(oauth -> oauth
        .successHandler(oAuth2SuccessHandler)
        .failureUrl("/oauth2/error")
      );

    return http.build();
  }
}

