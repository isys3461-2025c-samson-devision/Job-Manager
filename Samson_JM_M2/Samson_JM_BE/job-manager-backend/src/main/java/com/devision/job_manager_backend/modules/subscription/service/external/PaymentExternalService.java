package com.devision.job_manager_backend.modules.subscription.service.external;

import com.devision.job_manager_backend.modules.subscription.dto.external.CreateCheckoutSessionRequest;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;

public interface PaymentExternalService {

    String createCheckoutSession(CreateCheckoutSessionRequest request);

    void handlePaymentSuccess(
            String email,
            PayerType payerType,
            Double amount
    );

    void handlePaymentCancel(
            String email,
            PayerType payerType,
            Double amount
    );
}
