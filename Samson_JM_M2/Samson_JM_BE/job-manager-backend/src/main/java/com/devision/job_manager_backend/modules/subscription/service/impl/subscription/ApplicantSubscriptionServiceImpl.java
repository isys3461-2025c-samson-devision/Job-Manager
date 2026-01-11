package com.devision.job_manager_backend.modules.subscription.service.impl.subscription;

import com.devision.job_manager_backend.modules.subscription.service.internal.ApplicantSubscriptionService;
import com.devision.job_manager_backend.modules.subscription.model.*;
import com.devision.job_manager_backend.modules.subscription.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;


@Service
@RequiredArgsConstructor
public class ApplicantSubscriptionServiceImpl
        implements ApplicantSubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Override
    public void activateApplicantSubscription(
            String ownerId,
            String payerEmail,
            String stripeSubscriptionId
    ) {

        if (subscriptionRepository.existsByStripeSubscriptionId(stripeSubscriptionId)) {
            return;
        }

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
                .ownerType(PayerType.APPLICANT)
                .stripeSubscriptionId(stripeSubscriptionId)
                .startDate(now)
                .endDate(now.plus(30, ChronoUnit.DAYS))
                .status(SubscriptionStatus.ACTIVE)
                .build();

        subscriptionRepository.save(subscription);
    }

    @Override
    public boolean hasActiveSubscription(String applicantUserId) {
        return subscriptionRepository
                .findByOwnerIdAndStatus(
                        applicantUserId,
                        SubscriptionStatus.ACTIVE
                )
                .filter(sub -> sub.getEndDate().isAfter(Instant.now()))
                .isPresent();
    }
}
