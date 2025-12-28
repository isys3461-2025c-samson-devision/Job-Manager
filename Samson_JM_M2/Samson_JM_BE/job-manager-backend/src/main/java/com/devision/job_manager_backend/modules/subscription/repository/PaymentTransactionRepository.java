package com.devision.job_manager_backend.modules.subscription.repository;

import com.devision.job_manager_backend.modules.subscription.model.PaymentTransactionModel;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository
        extends MongoRepository<PaymentTransactionModel, String> {

    Optional<PaymentTransactionModel> findByStripeSessionId(String stripeSessionId);
}
