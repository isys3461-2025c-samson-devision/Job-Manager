package com.devision.job_manager_backend.modules.subscription.service.internal;

import java.time.Instant;
import java.util.Optional;


import org.springframework.stereotype.Service;

import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import com.devision.job_manager_backend.modules.subscription.repository.SubscriptionRepository;

import lombok.RequiredArgsConstructor;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    public Optional<SubscriptionModel> getCurrentSubscription(String ownerId) {

        System.out.println("[DEBUG] querying subscription for ownerId = '" + ownerId + "'");

        // 🔍 DEBUG: log all subscriptions in DB
        subscriptionRepository
            .findTopByOwnerIdAndStatusOrderByEndDateDesc(ownerId, SubscriptionStatus.ACTIVE)
            .ifPresentOrElse(
                s -> System.out.println(
                    "[DEBUG] MATCHED subscription ownerId=" + s.getOwnerId()
                    + ", status=" + s.getStatus()
                    + ", endDate=" + s.getEndDate()
                ),
                () -> System.out.println("[DEBUG] No subscription found for ownerId=" + ownerId)
            );


        return subscriptionRepository
                .findTopByOwnerIdAndStatusOrderByEndDateDesc(ownerId, SubscriptionStatus.ACTIVE);
    }

    public Optional<SubscriptionModel> getActiveByEmail(String ownerEmail) {
        return subscriptionRepository.findByOwnerEmailAndStatus(
                ownerEmail,
                SubscriptionStatus.ACTIVE
        );
    }

    public boolean isPremium(SubscriptionModel sub) {
        return sub.getStatus() == SubscriptionStatus.ACTIVE
                && sub.getEndDate().isAfter(Instant.now());
    }
}