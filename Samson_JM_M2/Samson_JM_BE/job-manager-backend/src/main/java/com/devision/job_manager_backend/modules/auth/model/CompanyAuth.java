package com.devision.job_manager_backend.modules.auth.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.lang.String;
import java.time.Instant;


@Document(collection = "company_auth")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyAuth {

    @Id
    private String id;

    private String companyName;

    private String phoneNumber;

    private String country;

    private String email;

    private String passwordHash;

    private String role;

    /**
     * Brute-force protection fields:
     * block auth after 5 failed attempts within 60 seconds.
     */
    private Integer failedLoginCount; // number of failed login attempts

    private Instant firstFailedAt; // timestamp of the first failed attempt

    private Instant lockUntil;  // timestamp until which the account is locked
}
