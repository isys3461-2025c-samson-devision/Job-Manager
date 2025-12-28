package com.devision.job_manager_backend.modules.subscription.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransactionModel {

    @Id
    private String id;

    private String payerEmail;
    private PayerType payerType;     // APPLICANT / COMPANY
    private Double amount;
    private String provider;         // STRIPE
    private PaymentStatus status;    // SUCCESS / FAILED
    private LocalDateTime createdAt;
}
