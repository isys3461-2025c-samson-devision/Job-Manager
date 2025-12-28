package com.devision.job_manager_backend.modules.subscription.service.external;

import com.devision.job_manager_backend.modules.subscription.dto.external.CreateCheckoutSessionRequest;

public interface PaymentExternalService {

    String createCheckoutSession(CreateCheckoutSessionRequest request);

    void handlePaymentSuccess(
            String email,
            String payerType,
            Double amount
    );
}
