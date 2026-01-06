package com.devision.job_manager_backend.modules.subscription.dto.external.payment;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PaymentStatusResponse {
    private String status;
    private String message;
}
