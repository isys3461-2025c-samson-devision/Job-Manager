package com.devision.job_manager_backend.modules.subscription.dto.external;

import com.devision.job_manager_backend.modules.subscription.model.PayerType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateCheckoutSessionRequest {

    private String email;
    private PayerType payerType;   // COMPANY / APPLICANT
    private Double amount;

    private String successUrl;
    private String cancelUrl;
}
