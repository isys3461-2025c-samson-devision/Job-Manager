package com.devision.job_manager_backend.modules.subscription.service.impl.payment;

import com.devision.job_manager_backend.modules.subscription.dto.external.CreateCheckoutSessionRequest;
import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.service.external.PaymentExternalService;
import com.devision.job_manager_backend.modules.subscription.service.internal.*;
import com.devision.job_manager_backend.modules.company.service.CompanyService;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;

import com.devision.job_manager_backend.modules.company.model.Company;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentExternalServiceImpl implements PaymentExternalService {

    private final CompanyService companyService;

    private final PaymentInternalService paymentInternalService;
    private final CompanySubscriptionService companySubscriptionService;
    private final ApplicantSubscriptionService applicantSubscriptionService;

    @Value("${stripe.success-url}")
    private String successUrl;

    @Value("${stripe.cancel-url}")
    private String cancelUrl;

    @Override
    public String createCheckoutSession(CreateCheckoutSessionRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                throw new IllegalStateException("User not authenticated");
            }

            // ✅ auth.getName() = userId (company user)
            String userId = auth.getName();

            // ✅ get company (auto-created if missing)
            Company company = companyService.getOrCreateMyCompany(userId);

            // ✅ REAL email (Stripe-safe)
            String payerEmail = company.getEmail();

            SessionCreateParams params =
                SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(cancelUrl)

                    // ✅ Stripe requires a VALID email
                    .setCustomerEmail(payerEmail)

                    // ✅ Metadata for webhook → DB
                    .putMetadata("payerEmail", payerEmail)
                    .putMetadata("payerType", PayerType.COMPANY.name())
                    .putMetadata("userId", userId)

                    .addLineItem(
                        SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("usd")
                                    .setUnitAmount(request.getAmount().longValue() * 100)
                                    .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName("Company Subscription")
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
