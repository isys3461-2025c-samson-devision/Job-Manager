package com.devision.job_manager_backend.modules.company.model;

import java.time.Instant;
import java.time.LocalDateTime;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    private String id;

    // 🔗 Auth linkage
    private String userId;   // JWT subject (immutable)
    private String email;    // copied from Auth (immutable)

    // 🏢 Company basic info
    private String companyName;
    private String phoneNumber;
    private String street;
    private String city;
    private String country;

    // 🌐 Public profile content
    private String aboutUs;
    private String whoWeAreLookingFor;

    // 🖼️ Media (later: file upload)
    private String logoUrl;

    // 🕒 Metadata
    private Instant createdAt;
    private Instant updatedAt;
}
