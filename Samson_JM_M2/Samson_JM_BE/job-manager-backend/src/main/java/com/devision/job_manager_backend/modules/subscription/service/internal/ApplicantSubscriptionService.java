package com.devision.job_manager_backend.modules.subscription.service.internal;

public interface ApplicantSubscriptionService {

    void activateApplicantSubscription(String ownerId, String applicantEmail);

    //boolean hasActiveSubscription(String applicantUserId);

}