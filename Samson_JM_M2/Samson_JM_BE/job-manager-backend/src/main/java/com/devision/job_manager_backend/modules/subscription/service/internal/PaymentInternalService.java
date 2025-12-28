package com.devision.job_manager_backend.modules.subscription.service.internal;

import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;

public interface PaymentInternalService {

    void recordPayment(
            String email,
            PayerType payerType,
            Double amount,
            PaymentStatus status
    );
}
