package com.devision.job_manager_backend.modules.subscription.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "subscription")
@Getter
@Setter
public class SubscriptionModel {
    @Id
    private String id;
    private String companyId;
    private SubscriptionPlan plan;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer priceUsd;
    private String paymentProvider;
    private String paymentRef;
    private SubscriptionStatus status;
    private boolean preExpiryNotified;
    private boolean expiredNotified;
    private LocalDateTime updatedAt;
}
