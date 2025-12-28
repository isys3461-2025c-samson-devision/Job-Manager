package com.devision.job_manager_backend.modules.subscription.repository;

import com.devision.job_manager_backend.modules.subscription.model.PaymentTransactionModel;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PaymentTransactionRepository
        extends MongoRepository<PaymentTransactionModel, String> {

    List<PaymentTransactionModel> findByPayerEmailOrderByCreatedAtDesc(String payerEmail);
}
