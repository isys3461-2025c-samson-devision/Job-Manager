package com.devision.job_manager_backend.modules.subscription.service.impl;

import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;
import com.devision.job_manager_backend.modules.subscription.dto.internal.ActivateApplicantSubscriptionCommand;
import com.devision.job_manager_backend.modules.subscription.dto.internal.ActivateCompanySubscriptionCommand;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.service.internal.*;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentWebhookServiceImpl implements PaymentWebHookService {

    private final PaymentInternalService paymentInternalService;
    private final CompanySubscriptionService companySubscriptionService;
    private final ApplicantSubscriptionService applicantSubscriptionService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Override
    public void handleStripeEvent(String payload, String signature) {

        Event event;
        try {
            event = Webhook.constructEvent(payload, signature, webhookSecret);
        } catch (Exception e) {
            throw new RuntimeException("Invalid Stripe webhook signature", e);
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> handleCheckoutCompleted(payload);
            case "payment_intent.payment_failed" -> handlePaymentFailed(event);
            default -> {
                // ignored
            }
        }
    }

    private void handleCheckoutCompleted(String payload) {

        JsonObject json = JsonParser.parseString(payload).getAsJsonObject();

        JsonObject session = json
                .getAsJsonObject("data")
                .getAsJsonObject("object");

        // ✅ Stripe-guaranteed email
        String payerEmail = session.has("customer_email")
                ? session.get("customer_email").getAsString()
                : null;

        if (payerEmail == null || payerEmail.isBlank()) {
            throw new IllegalStateException("Stripe session missing customer_email");
        }

        // ✅ Payer type (optional metadata)
        PayerType payerType = PayerType.COMPANY;
        if (session.has("metadata")) {
            JsonObject metadata = session.getAsJsonObject("metadata");
            if (metadata.has("payerType")) {
                payerType = PayerType.valueOf(metadata.get("payerType").getAsString());
            }
        }

        // ✅ Amount is always cents
        double amount = session.get("amount_total").getAsDouble() / 100.0;

        // ✅ Stripe session ID
        String sessionId = session.get("id").getAsString();

        paymentInternalService.recordPayment(
                payerEmail,
                payerType,
                amount,
                PaymentStatus.SUCCESS,
                sessionId
        );

        // 2️⃣ Activate subscription WITH SAME EMAIL
        if (payerType == PayerType.COMPANY) {
            companySubscriptionService.activateCompanySubscription(payerEmail);
        } else {
            applicantSubscriptionService.activateApplicantSubscription(payerEmail);
        }
    }









    private void handlePaymentFailed(Event event) {

        PaymentIntent intent = (PaymentIntent) event
                .getDataObjectDeserializer()
                .getObject()
                .orElseThrow();

        String sessionId = intent.getMetadata().get("checkout_session_id");
        paymentInternalService.markPaymentFailed(sessionId);

    }
}
