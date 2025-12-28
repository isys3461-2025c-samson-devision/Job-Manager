package com.devision.job_manager_backend.modules.subscription.dto.external.payment;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentHistoryResponse {
    private Double amount;
    private String status;
    private String provider;
    private LocalDateTime createdAt;
}
