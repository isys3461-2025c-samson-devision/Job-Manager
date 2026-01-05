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
public class CompanySubscriptionServiceImpl implements CompanySubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Override
    public void activateCompanySubscription(String ownerId, String companyEmail) {

        // 1. Expire any existing ACTIVE subscription (safety)
        Optional<SubscriptionModel> existing =
                subscriptionRepository.findByOwnerEmailAndStatus(
                        companyEmail,
                        SubscriptionStatus.ACTIVE
                );

        existing.ifPresent(sub -> {
            sub.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(sub);
        });

        Instant now = Instant.now();

        // 2. Create new subscription
        SubscriptionModel newSubscription = SubscriptionModel.builder()
                .ownerId(ownerId)
                .ownerEmail(companyEmail)
                .ownerType(PayerType.COMPANY)
                .startDate(now)
                .endDate(now.plus(30, ChronoUnit.DAYS))
                .status(SubscriptionStatus.ACTIVE)
                .build();

        subscriptionRepository.save(newSubscription);

        if (ownerId == null || ownerId.isBlank()) {
            throw new IllegalStateException("ownerId must not be null when creating subscription");
        }

    }

    @Override
    public boolean hasActiveSubscription(String ownerId) {
        return subscriptionRepository
            .findFirstByOwnerIdAndStatus(ownerId, SubscriptionStatus.ACTIVE)
            .filter(sub -> sub.getEndDate().isAfter(Instant.now()))
            .isPresent();
    }
}
