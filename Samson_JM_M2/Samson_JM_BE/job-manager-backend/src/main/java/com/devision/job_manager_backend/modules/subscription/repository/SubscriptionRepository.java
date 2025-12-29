package com.devision.job_manager_backend.modules.subscription.repository;

import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SubscriptionRepository
        extends MongoRepository<SubscriptionModel, String> {

    Optional<SubscriptionModel> findByOwnerEmailAndStatus(
        String ownerEmail,
        SubscriptionStatus status
    );
    
    Optional<SubscriptionModel> findTopByOwnerIdAndStatusOrderByEndDateDesc(
        String ownerId,
        SubscriptionStatus status
);

}
