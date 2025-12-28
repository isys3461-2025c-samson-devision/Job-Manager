package com.devision.job_manager_backend.modules.subscription.dto.internal;

public class ActivateApplicantSubscriptionCommand {
    
    private Long applicantId;
    private String priceId;
    private String paymentIntentId;

    public ActivateApplicantSubscriptionCommand(Long applicantId, String priceId, String paymentIntentId) {
        this.applicantId = applicantId;
        this.priceId = priceId;
        this.paymentIntentId = paymentIntentId;
    }

    public Long getApplicantId() {
        return applicantId;
    }

    public String getPriceId() {
        return priceId;
    }

    public String getPaymentIntentId() {
        return paymentIntentId;
    }
}
