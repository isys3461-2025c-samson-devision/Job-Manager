package com.devision.job_manager_backend.modules.subscription.service.internal;

public interface ApplicantSubscriptionService {

    void activateApplicantSubscription(String ownerId, String payerEmail, String stripeSubscriptionId);

    boolean hasActiveSubscription(String applicantUserId);

}