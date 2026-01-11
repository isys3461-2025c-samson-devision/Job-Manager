package com.devision.job_manager_backend.modules.subscription.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;

@Document(collection = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionModel {

    @Id
    private String id;

    private String ownerId;

    @Indexed(unique = true)
    private String stripeSubscriptionId;

    private String ownerEmail;
    private PayerType ownerType;     // COMPANY / APPLICANT
    private Instant startDate;
    private Instant endDate;
    private SubscriptionStatus status;
}
