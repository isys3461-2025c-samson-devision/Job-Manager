package com.devision.job_manager_backend.modules.subscription.service.impl.payment;

import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;
import com.devision.job_manager_backend.modules.subscription.model.PaymentTransactionModel;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.repository.PaymentTransactionRepository;
import com.devision.job_manager_backend.modules.subscription.service.internal.PaymentInternalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentInternalServiceImpl implements PaymentInternalService {

    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    public void recordPayment(
            String email,
            PayerType payerType,
            Double amount,
            PaymentStatus status,
            String stripeSessionId
    ) {
        PaymentTransactionModel transaction = PaymentTransactionModel.builder()
                .payerEmail(email)
                .payerType(payerType)
                .amount(amount)
                .stripeSessionId(stripeSessionId)
                .provider("STRIPE")
                .status(status)
                .createdAt(LocalDateTime.now())
                .build();

        paymentTransactionRepository.save(transaction);
    }

    @Override
    public void markPaymentFailed(String stripeSessionId) {
        paymentTransactionRepository
                .findByStripeSessionId(stripeSessionId)
                .ifPresent(tx -> {
                    tx.setStatus(PaymentStatus.FAILED);
                    paymentTransactionRepository.save(tx);
                });
    }
}
