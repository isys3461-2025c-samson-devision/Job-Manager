package com.devision.job_manager_backend.modules.subscription.dto.external;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCheckoutSessionRequest {

    private String email;
    private String payerType;   // COMPANY / APPLICANT
    private Double amount;

    private String successUrl;
    private String cancelUrl;
}
