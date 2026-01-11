package com.devision.job_manager_backend.modules.subscription.repository;

import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
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

    Optional<SubscriptionModel> findByOwnerIdAndStatus(
        String ownerId,
        SubscriptionStatus status

    );

    List<SubscriptionModel> findAllByStatusAndOwnerType(
        SubscriptionStatus status,
        PayerType ownerType
    );


    boolean existsByStripeSubscriptionId(String stripeSubscriptionId);

    default SubscriptionModel findActiveByOwnerId(String ownerId) {
        return findByOwnerIdAndStatus(
            ownerId,
            SubscriptionStatus.ACTIVE
        ).orElseThrow(() ->
            new RuntimeException("Active subscription not found for ownerId: " + ownerId)
        );
    }

}
