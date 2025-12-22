package com.devision.job_manager_backend.modules.auth.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "company_auth")
@Getter
@Setter
@NoArgsConstructor
public class CompanyAuth {

    @Id
    private String id;

    private String companyName;

    private String phoneNumber;

    private String country;

    private String email;

    private String passwordHash;

    private String role;
}
