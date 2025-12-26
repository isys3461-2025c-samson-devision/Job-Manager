package com.devision.job_manager_backend.modules.auth.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "company_auth")
@Getter
@Setter
public class CompanyAuth {

    @Id
    private String id;

    private String companyName;

    private String phoneNumber;

    private String country;
    
    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private String role;
}
