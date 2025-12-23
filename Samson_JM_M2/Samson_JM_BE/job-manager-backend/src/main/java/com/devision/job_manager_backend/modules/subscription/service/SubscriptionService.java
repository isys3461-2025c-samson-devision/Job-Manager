package com.devision.job_manager_backend.modules.subscription.service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.stereotype.Service;

import com.devision.job_manager_backend.modules.subscription.DTO.request.ConfirmSubscriptionRequest;
import com.devision.job_manager_backend.modules.subscription.DTO.response.SubscriptionStatusResponse;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionPlan;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import com.devision.job_manager_backend.modules.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private static final int PREMIUM_PRICE_USD = 30;

    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionStatusResponse getCurrentStatus(String companyId) {
        SubscriptionModel subscription = subscriptionRepository.findByCompanyId(companyId)
            .orElse(null);

        if (subscription == null) {
            return new SubscriptionStatusResponse(
                SubscriptionPlan.FREE,
                SubscriptionStatus.ACTIVE,
                null,
                null,
                0,
                false
            );
        }

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        if (subscription.getStatus() == SubscriptionStatus.ACTIVE
            && subscription.getEndDate() != null
            && subscription.getEndDate().isBefore(now)) {
            subscription.setStatus(SubscriptionStatus.EXPIRED);
            subscription.setUpdatedAt(now);
            subscriptionRepository.save(subscription);
        }

        return toResponse(subscription);
    }

    public SubscriptionStatusResponse confirmPremium(
        String companyId,
        ConfirmSubscriptionRequest request
    ) {
        SubscriptionModel subscription = subscriptionRepository.findByCompanyId(companyId)
            .orElseGet(SubscriptionModel::new);

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

        subscription.setCompanyId(companyId);
        subscription.setPlan(SubscriptionPlan.PREMIUM);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setStartDate(now);
        subscription.setEndDate(now.plusMonths(1));
        subscription.setPriceUsd(PREMIUM_PRICE_USD);
        subscription.setPaymentProvider(request.getProvider());
        subscription.setPaymentRef(request.getPaymentRef());
        subscription.setPreExpiryNotified(false);
        subscription.setExpiredNotified(false);
        subscription.setUpdatedAt(now);

        subscriptionRepository.save(subscription);
        return toResponse(subscription);
    }

    public SubscriptionStatusResponse cancel(String companyId) {
        SubscriptionModel subscription = subscriptionRepository.findByCompanyId(companyId)
            .orElseThrow(() -> new RuntimeException("Subscription not found"));

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setEndDate(now);
        subscription.setUpdatedAt(now);

        subscriptionRepository.save(subscription);
        return toResponse(subscription);
    }

    private SubscriptionStatusResponse toResponse(SubscriptionModel subscription) {
        boolean premium = subscription.getPlan() == SubscriptionPlan.PREMIUM
            && subscription.getStatus() == SubscriptionStatus.ACTIVE;

        return new SubscriptionStatusResponse(
            subscription.getPlan(),
            subscription.getStatus(),
            subscription.getStartDate(),
            subscription.getEndDate(),
            subscription.getPriceUsd(),
            premium
        );
    }
}
