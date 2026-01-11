package com.devision.job_manager_backend.modules.subscription.service.internal;

public interface CompanySubscriptionService {

    void activateCompanySubscription(String ownerId, String payerEmail, String stripeSubscriptionId);

    boolean hasActiveSubscription(String ownerId);

}
