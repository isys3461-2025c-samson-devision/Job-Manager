package com.devision.job_manager_backend.modules.subscription.dto.external.subscription;

import java.time.Instant;

import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {

    private SubscriptionStatus status;
    private Instant startDate;
    private Instant endDate;
    private boolean isPremium;

}