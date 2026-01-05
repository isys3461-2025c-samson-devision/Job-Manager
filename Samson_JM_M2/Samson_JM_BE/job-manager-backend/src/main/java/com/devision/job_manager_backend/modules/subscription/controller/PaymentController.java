package com.devision.job_manager_backend.modules.subscription.controller;

import com.devision.job_manager_backend.modules.subscription.dto.external.CreateCheckoutSessionRequest;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import com.devision.job_manager_backend.modules.subscription.service.external.PaymentExternalService;
import com.devision.job_manager_backend.modules.subscription.service.internal.PaymentInternalService;
import com.devision.job_manager_backend.modules.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentExternalService paymentExternalService;
    private final PaymentInternalService paymentInternalService;
    private final SubscriptionRepository subscriptionRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> createCheckoutSession( 
    ) {
        String checkoutUrl = paymentExternalService.createCheckoutSession();

        return ResponseEntity.ok(
                java.util.Map.of("checkoutUrl", checkoutUrl)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyPayments(Authentication authentication) {

        String companyId = authentication.getName();

        return subscriptionRepository
            .findFirstByOwnerIdAndStatus(companyId, SubscriptionStatus.ACTIVE)
            .map(subscription -> {
                String payerEmail = subscription.getOwnerEmail();
                return ResponseEntity.ok(
                    paymentInternalService.getPaymentHistory(payerEmail)
                );
            })
            .orElseGet(() ->
                // ✅ Free plan or no active subscription → empty history
                ResponseEntity.ok(java.util.List.of())
            );
    }




//     @GetMapping("/success")
//     public ResponseEntity<?> handlePaymentSuccess(
//             @RequestParam String email,
//             @RequestParam PayerType payerType,
//             @RequestParam Double amount
//     ) {
//         paymentExternalService.handlePaymentSuccess(email, payerType, amount);
//         return ResponseEntity.ok("Payment successful");
//     }

//     @GetMapping("/cancel")
//     public ResponseEntity<?> handlePaymentCancel(
//             @RequestParam String email,
//             @RequestParam PayerType payerType,
//             @RequestParam Double amount
//     ) {
//         paymentInternalService.recordPayment(
//                 email,
//                 payerType,
//                 amount,
//                 PaymentStatus.CANCELLED,
//                 null
//         );
//         return ResponseEntity.ok("Payment cancelled");
//     }
}
