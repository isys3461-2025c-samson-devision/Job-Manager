package com.devision.job_manager_backend.modules.subscription.controller;

import com.devision.job_manager_backend.modules.subscription.dto.external.payment.PaymentHistoryResponse;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;
import com.devision.job_manager_backend.modules.subscription.dto.external.CreateCheckoutSessionRequest;
import com.devision.job_manager_backend.modules.subscription.repository.PaymentTransactionRepository;
import com.devision.job_manager_backend.modules.subscription.service.external.PaymentExternalService;
import com.devision.job_manager_backend.modules.subscription.service.internal.PaymentInternalService;
import com.devision.job_manager_backend.modules.subscription.service.internal.ApplicantSubscriptionService;
import com.devision.job_manager_backend.modules.subscription.service.internal.CompanySubscriptionService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentExternalService paymentExternalService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    // ==============================
    // 1️⃣ START CHECKOUT (Stripe)
    // ==============================
    @PostMapping("/checkout")
    public ResponseEntity<?> createCheckoutSession(
            @RequestBody CreateCheckoutSessionRequest request
    ) {
        String redirectUrl = paymentExternalService.createCheckoutSession(request);
        return ResponseEntity.ok(redirectUrl);
    }

    // ==============================
    // 2️⃣ STRIPE SUCCESS CALLBACK
    // ==============================
    @GetMapping("/success")
    public ResponseEntity<?> handlePaymentSuccess(
            @RequestParam String email,
            @RequestParam PayerType payerType,
            @RequestParam Double amount
    ) {
        paymentExternalService.handlePaymentSuccess(email, payerType, amount);
        return ResponseEntity.ok("Payment successful and subscription activated");
    }

//     // ==============================
//     // 3️⃣ PAYMENT HISTORY
//     // ==============================
//     @GetMapping("/history")
//     public ResponseEntity<List<PaymentHistoryResponse>> getPaymentHistory(
//             Principal principal
//     ) {
//         List<PaymentHistoryResponse> history =
//                 paymentTransactionRepository
//                         .findByPayerEmailOrderByCreatedAtDesc(principal.getName())
//                         .stream()
//                         .map(tx -> PaymentHistoryResponse.builder()
//                                 .amount(tx.getAmount())
//                                 .status(tx.getStatus().name())
//                                 .provider(tx.getProvider())
//                                 .createdAt(tx.getCreatedAt())
//                                 .build()
//                         )
//                         .toList();

//         return ResponseEntity.ok(history);
//     }
}
