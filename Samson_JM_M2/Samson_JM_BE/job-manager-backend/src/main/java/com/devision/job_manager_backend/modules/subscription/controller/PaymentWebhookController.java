package com.devision.job_manager_backend.modules.subscription.controller;

import com.devision.job_manager_backend.modules.subscription.service.internal.PaymentWebHookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/webhook")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final PaymentWebHookService paymentWebhookService;

    @PostMapping
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature
    ) {
        paymentWebhookService.handleStripeEvent(payload, signature);
        return ResponseEntity.ok().build();
    }
}
