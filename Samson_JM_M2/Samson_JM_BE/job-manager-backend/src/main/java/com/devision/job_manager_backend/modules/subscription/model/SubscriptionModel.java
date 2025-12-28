package com.devision.job_manager_backend.modules.subscription.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionModel {

    @Id
    private String id;

    private String ownerEmail;
    private PayerType ownerType;     // COMPANY / APPLICANT
    private LocalDate startDate;
    private LocalDate endDate;
    private SubscriptionStatus status;
}
