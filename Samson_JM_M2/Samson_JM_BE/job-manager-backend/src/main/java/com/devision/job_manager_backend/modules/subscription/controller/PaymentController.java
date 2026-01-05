package com.devision.job_manager_backend.modules.subscription.controller;

import com.devision.job_manager_backend.modules.subscription.dto.external.CreateCheckoutSessionRequest;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.model.PaymentStatus;
import com.devision.job_manager_backend.modules.subscription.service.external.PaymentExternalService;
import com.devision.job_manager_backend.modules.subscription.service.internal.PaymentInternalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentExternalService paymentExternalService;
    private final PaymentInternalService paymentInternalService;

    @PostMapping("/checkout")
    public ResponseEntity<?> createCheckoutSession( 
    ) {
        String checkoutUrl = paymentExternalService.createCheckoutSession();

        return ResponseEntity.ok(
                java.util.Map.of("checkoutUrl", checkoutUrl)
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
