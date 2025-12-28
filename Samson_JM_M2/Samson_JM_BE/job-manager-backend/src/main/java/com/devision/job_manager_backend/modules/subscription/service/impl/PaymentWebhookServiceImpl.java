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
            case "checkout.session.completed" -> handleCheckoutCompleted(event);
            case "payment_intent.payment_failed" -> handlePaymentFailed(event);
            default -> {
                // ignored
            }
        }
    }

    private void handleCheckoutCompleted(Event event) {

        log.info("📩 checkout.session.completed received");

        JsonObject root = JsonParser.parseString(event.toJson()).getAsJsonObject();
        JsonObject sessionJson = root
            .getAsJsonObject("data")
            .getAsJsonObject("object");

        String sessionId = sessionJson.get("id").getAsString();
        double amount = sessionJson.get("amount_total").getAsDouble() / 100.0;

        JsonObject metadata = sessionJson.getAsJsonObject("metadata");

        if (metadata == null || metadata.size() == 0) {
            log.error("❌ Metadata missing in session {}", sessionId);
            return;
        }

        String email = metadata.get("email").getAsString();
        PayerType payerType = PayerType.valueOf(metadata.get("payerType").getAsString());

        paymentInternalService.recordPayment(
            email,
            payerType,
            amount,
            PaymentStatus.SUCCESS,
            sessionId
        );

        if (payerType == PayerType.COMPANY) {
            companySubscriptionService.activateCompanySubscription(email);
        } else {
            applicantSubscriptionService.activateApplicantSubscription(email);
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
