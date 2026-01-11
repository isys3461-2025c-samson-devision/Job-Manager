package com.devision.job_manager_backend.modules.subscription.service.impl.subscription;

import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import com.devision.job_manager_backend.modules.subscription.repository.SubscriptionRepository;
import com.devision.job_manager_backend.modules.subscription.service.internal.CompanySubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class CompanySubscriptionServiceImpl
        implements CompanySubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Override
    public void activateCompanySubscription(
            String ownerId,
            String payerEmail,
            String stripeSubscriptionId
    ) {

        if (ownerId == null || ownerId.isBlank()) {
            throw new IllegalStateException("ownerId must not be null");
        }

        // ✅ Idempotency (VERY IMPORTANT)
        if (subscriptionRepository.existsByStripeSubscriptionId(stripeSubscriptionId)) {
            return;
        }

        // ✅ Expire existing ACTIVE subscription
        subscriptionRepository
                .findByOwnerIdAndStatus(ownerId, SubscriptionStatus.ACTIVE)
                .ifPresent(sub -> {
                    sub.setStatus(SubscriptionStatus.EXPIRED);
                    subscriptionRepository.save(sub);
                });

        Instant now = Instant.now();

        SubscriptionModel subscription = SubscriptionModel.builder()
                .ownerId(ownerId)
                .ownerEmail(payerEmail)
                .ownerType(PayerType.COMPANY)
                .stripeSubscriptionId(stripeSubscriptionId)
                .startDate(now)
                .endDate(now.plus(30, ChronoUnit.DAYS))
                .status(SubscriptionStatus.ACTIVE)
                .build();

        subscriptionRepository.save(subscription);
    }

    @Override
    public boolean hasActiveSubscription(String ownerId) {
        return subscriptionRepository
                .findByOwnerIdAndStatus(ownerId, SubscriptionStatus.ACTIVE)
                .filter(sub -> sub.getEndDate().isAfter(Instant.now()))
                .isPresent();
    }
}
