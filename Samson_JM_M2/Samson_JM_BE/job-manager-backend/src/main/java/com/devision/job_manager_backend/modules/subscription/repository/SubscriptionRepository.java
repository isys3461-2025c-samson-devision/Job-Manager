package com.devision.job_manager_backend.modules.subscription.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;

public interface SubscriptionRepository extends MongoRepository<SubscriptionModel, String> {
    Optional<SubscriptionModel> findByCompanyId(String companyId);

    List<SubscriptionModel> findByStatusAndEndDateBetween(
        SubscriptionStatus status,
        LocalDateTime start,
        LocalDateTime end
    );

    List<SubscriptionModel> findByStatusAndEndDateBefore(
        SubscriptionStatus status,
        LocalDateTime end
    );
}
