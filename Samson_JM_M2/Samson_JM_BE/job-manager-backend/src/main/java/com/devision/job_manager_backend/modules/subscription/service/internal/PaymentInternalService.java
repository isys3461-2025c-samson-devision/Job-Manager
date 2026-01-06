package com.devision.job_manager_backend.modules.subscription.service.internal;

import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;

import java.util.List;

import com.devision.job_manager_backend.modules.subscription.dto.external.payment.PaymentHistoryResponse;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;

public interface PaymentInternalService {
    List<PaymentHistoryResponse> getPaymentHistory(String payerEmail);

    void markPaymentFailed(String stripeSessionId);

    void recordPayment(
            String email,
            PayerType payerType,
            Double amount,
            PaymentStatus status,
            String stripeSessionId
    );
}
