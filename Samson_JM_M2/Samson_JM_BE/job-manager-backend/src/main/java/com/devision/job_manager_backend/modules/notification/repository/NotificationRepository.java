package com.devision.job_manager_backend.modules.notification.repository;

import com.devision.job_manager_backend.modules.notification.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository
        extends MongoRepository<Notification, String> {

    List<Notification> findByOwnerIdOrderByCreatedAtDesc(String ownerId);

    long countByOwnerIdAndReadFalse(String ownerId);

    boolean existsByOwnerIdAndSubscriptionIdAndMessage(
            String ownerId,
            String subscriptionId,
            String message
    );
}
