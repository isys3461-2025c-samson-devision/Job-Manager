package com.devision.job_manager_backend.modules.subscription.DTO.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfirmSubscriptionRequest {
    @NotBlank
    private String provider;

    @NotBlank
    private String paymentRef;
}
