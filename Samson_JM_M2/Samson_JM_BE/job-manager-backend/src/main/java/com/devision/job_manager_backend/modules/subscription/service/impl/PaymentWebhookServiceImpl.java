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

        if ("checkout.session.completed".equals(event.getType())) {
            handleCheckoutCompleted(payload);
        }
    }

    private void handleCheckoutCompleted(String payload) {

        JsonObject session = JsonParser.parseString(payload)
                .getAsJsonObject()
                .getAsJsonObject("data")
                .getAsJsonObject("object");

        JsonObject metadata = session.has("metadata")
                ? session.getAsJsonObject("metadata")
                : null;

        // ✅ 1. EMAIL (ONLY from metadata)
        String payerEmail = getNullableString(metadata, "payerEmail");
        if (payerEmail == null) {
            log.warn("Webhook ignored: missing payerEmail metadata");
            return;
        }

        // ✅ 2. PAYER TYPE
        PayerType payerType = PayerType.valueOf(
                getNullableString(metadata, "payerType")
        );

        // ✅ 3. OWNER ID (THIS is your Mongo key)
        String ownerId = getNullableString(metadata, "userId");
        if (ownerId == null) {
            log.warn("Webhook ignored: missing userId metadata");
            return;
        }

        // ✅ 4. STRIPE SUBSCRIPTION ID (CRITICAL)
        String stripeSubscriptionId = getNullableString(session, "subscription");
        if (stripeSubscriptionId == null) {
            log.warn("Webhook ignored: missing Stripe subscription ID");
            return;
        }

        // ✅ 5. AMOUNT
        Double amountCents = getNullableDouble(session, "amount_total");
        double amount = amountCents != null ? amountCents / 100.0 : 0.0;

        // ✅ 6. SESSION ID (idempotency key)
        String sessionId = getNullableString(session, "id");

        // ✅ 7. RECORD PAYMENT (idempotent)
        paymentInternalService.recordPayment(
                payerEmail,
                payerType,
                amount,
                PaymentStatus.SUCCESS,
                sessionId
        );

        // ✅ 8. ACTIVATE SUBSCRIPTION (THIS WAS MISSING)
        if (payerType == PayerType.COMPANY) {
            companySubscriptionService.activateCompanySubscription(
                    ownerId,
                    payerEmail,
                    stripeSubscriptionId
            );
        } else {
            applicantSubscriptionService.activateApplicantSubscription(
                    ownerId,
                    payerEmail,
                    stripeSubscriptionId
            );
        }

        log.info(
            "Subscription activated: ownerId={}, stripeSubId={}",
            ownerId,
            stripeSubscriptionId
        );
    }

    // ======================
    // Safe JSON helpers
    // ======================
    private String getNullableString(JsonObject obj, String key) {
        return obj != null && obj.has(key) && !obj.get(key).isJsonNull()
                ? obj.get(key).getAsString()
                : null;
    }

    private Double getNullableDouble(JsonObject obj, String key) {
        return obj != null && obj.has(key) && !obj.get(key).isJsonNull()
                ? obj.get(key).getAsDouble()
                : null;
    }
}
