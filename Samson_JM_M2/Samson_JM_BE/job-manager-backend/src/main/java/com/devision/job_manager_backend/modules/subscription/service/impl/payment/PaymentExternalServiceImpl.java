package com.devision.job_manager_backend.modules.subscription.service.impl.payment;

import com.devision.job_manager_backend.modules.subscription.dto.external.CreateCheckoutSessionRequest;
import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.service.external.PaymentExternalService;
import com.devision.job_manager_backend.modules.subscription.service.internal.ApplicantSubscriptionService;
import com.devision.job_manager_backend.modules.subscription.service.internal.CompanySubscriptionService;
import com.devision.job_manager_backend.modules.subscription.service.internal.PaymentInternalService;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentExternalServiceImpl implements PaymentExternalService {

    private final PaymentInternalService paymentInternalService;
    private final CompanySubscriptionService companySubscriptionService;
    private final ApplicantSubscriptionService applicantSubscriptionService;

    // ==============================
    // 1️⃣ CREATE STRIPE CHECKOUT
    // ==============================
    @Override
    public String createCheckoutSession(CreateCheckoutSessionRequest request) {
        try {
            SessionCreateParams params =
                SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(request.getSuccessUrl())
                    .setCancelUrl(request.getCancelUrl())
                    .addLineItem(
                        SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("usd")
                                    .setUnitAmount(request.getAmount().longValue() * 100)
                                    .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName(
                                                request.getPayerType() + " Subscription"
                                            )
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


    // ==============================
    // 2️⃣ HANDLE PAYMENT SUCCESS
    // ==============================
    @Override
    public void handlePaymentSuccess(
            String email,
            PayerType payerType,
            Double amount
    ) {

        // 1️⃣ Record payment
        paymentInternalService.recordPayment(
                email,
                payerType,
                amount,
                PaymentStatus.SUCCESS
        );

        // 2️⃣ Activate subscription
        if (payerType == PayerType.COMPANY) {
            companySubscriptionService.activateCompanySubscription(email);
        } else {
            applicantSubscriptionService.activateApplicantSubscription(email);
        }
    }



}
