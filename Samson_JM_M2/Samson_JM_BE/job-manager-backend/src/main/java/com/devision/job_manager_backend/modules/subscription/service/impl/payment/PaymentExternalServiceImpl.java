package com.devision.job_manager_backend.modules.subscription.service.impl.payment;

import com.devision.job_manager_backend.modules.subscription.dto.external.CreateCheckoutSessionRequest;
import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.service.external.PaymentExternalService;
import com.devision.job_manager_backend.modules.subscription.service.internal.*;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentExternalServiceImpl implements PaymentExternalService {

    private final PaymentInternalService paymentInternalService;
    private final CompanySubscriptionService companySubscriptionService;
    private final ApplicantSubscriptionService applicantSubscriptionService;

    @Override
    public String createCheckoutSession(CreateCheckoutSessionRequest request) {
        try {
            SessionCreateParams params =
                SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(request.getSuccessUrl())
                    .setCancelUrl(request.getCancelUrl())

                    // ✅ payerType is already String
                    .putMetadata("payerType", request.getPayerType().name())
                    .putMetadata("email", request.getEmail())
                    .addAllExpand(List.of("payment_intent")) // 🔴 ADD THIS
                    .addLineItem(
                        SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("usd")
                                    .setUnitAmount(request.getAmount().longValue() * 100)
                                    .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName(request.getPayerType() + " Subscription")
                                            .build()
                                    )
                                    .build()
                            )
                            .build()
                    )
                    .build();


            Session session = Session.create(params);
            return session.getUrl();

        } catch (Exception e) {
            throw new RuntimeException("Stripe checkout failed", e);
        }
    }

    @Override
    public void handlePaymentSuccess(String email, PayerType payerType, Double amount) {
        // UI-only fallback (webhook is authoritative)
        paymentInternalService.recordPayment(email, payerType, amount, PaymentStatus.SUCCESS, null);
    }

    @Override
    public void handlePaymentCancel(String email, PayerType payerType, Double amount) {
        paymentInternalService.recordPayment(email, payerType, amount, PaymentStatus.CANCELLED, null);
    }
}
