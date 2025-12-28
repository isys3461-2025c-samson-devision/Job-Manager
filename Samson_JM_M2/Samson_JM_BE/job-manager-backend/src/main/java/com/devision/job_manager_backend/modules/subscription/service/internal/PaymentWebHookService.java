package com.devision.job_manager_backend.modules.subscription.service.internal;

public interface PaymentWebHookService {

    void handleStripeEvent(String payload, String signature);
}
