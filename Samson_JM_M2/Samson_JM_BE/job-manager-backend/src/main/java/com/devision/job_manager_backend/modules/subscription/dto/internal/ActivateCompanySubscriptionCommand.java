
package com.devision.job_manager_backend.modules.subscription.dto.internal;

public record ActivateCompanySubscriptionCommand(
    Long companyId,
    String priceId,
    String paymentIntentId
) {
}