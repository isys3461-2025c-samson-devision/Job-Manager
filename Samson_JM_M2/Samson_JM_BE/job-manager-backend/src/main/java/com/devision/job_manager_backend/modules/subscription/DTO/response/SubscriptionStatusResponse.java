package com.devision.job_manager_backend.modules.subscription.DTO.response;

import java.time.LocalDateTime;

import com.devision.job_manager_backend.modules.subscription.model.SubscriptionPlan;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SubscriptionStatusResponse {
    private SubscriptionPlan plan;
    private SubscriptionStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer priceUsd;
    private boolean premium;
}
