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

    public Optional<SubscriptionModel> getCurrentSubscription(String ownerEmail) {

        System.out.println("[DEBUG] querying subscription for email = '" + ownerEmail + "'");

        // 🔍 DEBUG: log all subscriptions in DB
        subscriptionRepository.findAll()
            .forEach(s ->
                System.out.println(
                    "[DEBUG] owner=" + s.getOwnerEmail()
                    + ", status=" + s.getStatus()
                    + ", endDate=" + s.getEndDate()
                )
            );

        return subscriptionRepository
                .findTopByOwnerEmailOrderByEndDateDesc(ownerEmail);
    }

    public boolean isPremium(SubscriptionModel sub) {
        return sub.getStatus() == SubscriptionStatus.ACTIVE
                && sub.getEndDate().isAfter(Instant.now());
    }
}