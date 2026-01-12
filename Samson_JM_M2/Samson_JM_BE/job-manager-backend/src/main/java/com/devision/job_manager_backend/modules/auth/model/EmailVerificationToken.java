package com.devision.job_manager_backend.modules.auth.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;



@Document("email_verification_tokens")
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationToken {

    @Id
    private String id;

    private String token;
    private String companyAuthId;
    private String email;
    private Instant expiresAt;
}

