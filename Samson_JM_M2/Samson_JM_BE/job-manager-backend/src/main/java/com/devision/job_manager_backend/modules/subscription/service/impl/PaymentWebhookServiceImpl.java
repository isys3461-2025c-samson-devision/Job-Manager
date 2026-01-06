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

        // 1️⃣ Email (DO NOT trust customer_email)
        String payerEmail = getNullableString(session, "payer_email");

        // Fallback: metadata email (BEST PRACTICE)
        JsonObject metadata = session.has("metadata")
                ? session.getAsJsonObject("metadata")
                : null;

        if (payerEmail == null) {
            payerEmail = getNullableString(metadata, "payerEmail");
        }

        if (payerEmail == null) {
            log.warn("Webhook ignored: missing payer email");
            return; // ❗ NEVER throw
        }

        // 2️⃣ Payer type
        PayerType payerType = PayerType.COMPANY;
        String payerTypeRaw = getNullableString(metadata, "payerType");
        if (payerTypeRaw != null) {
            payerType = PayerType.valueOf(payerTypeRaw);
        }

        // 3️⃣ Owner ID
        String ownerId = getNullableString(metadata, "userId");
        if (ownerId == null) {
            log.warn("Webhook ignored: missing userId metadata");
            return;
        }

        // 4️⃣ Amount
        Double amountCents = getNullableDouble(session, "amount_total");
        double amount = amountCents != null ? amountCents / 100.0 : 0.0;

        // 5️⃣ Session ID
        String sessionId = getNullableString(session, "id");
        if (sessionId == null) {
            log.warn("Webhook ignored: missing session id");
            return;
        }

        // 6️⃣ Record payment (idempotent)
        paymentInternalService.recordPayment(
                payerEmail,
                payerType,
                amount,
                PaymentStatus.SUCCESS,
                sessionId
        );

        // 7️⃣ Activate subscription
        if (payerType == PayerType.COMPANY) {
            companySubscriptionService.activateCompanySubscription(ownerId, payerEmail);
        } else {
            applicantSubscriptionService.activateApplicantSubscription(ownerId, payerEmail);
        }

        log.info("Stripe checkout completed: sessionId={}, payer={}", sessionId, payerEmail);
    }











    private void handlePaymentFailed(Event event) {

        PaymentIntent intent = (PaymentIntent) event
                .getDataObjectDeserializer()
                .getObject()
                .orElseThrow();

        String sessionId = intent.getMetadata().get("checkout_session_id");
        paymentInternalService.markPaymentFailed(sessionId);

    }

    // ======================
    // Safe JSON helpers
    // ======================
    private String getNullableString(JsonObject obj, String key) {
        if (obj == null || !obj.has(key) || obj.get(key).isJsonNull()) {
            return null;
        }
        return obj.get(key).getAsString();
    }

    private Double getNullableDouble(JsonObject obj, String key) {
        if (obj == null || !obj.has(key) || obj.get(key).isJsonNull()) {
            return null;
        }
        return obj.get(key).getAsDouble();
    }

}
