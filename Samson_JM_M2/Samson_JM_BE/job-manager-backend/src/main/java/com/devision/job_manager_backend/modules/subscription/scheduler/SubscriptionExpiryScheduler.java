package com.devision.job_manager_backend.modules.subscription.scheduler;

import com.devision.job_manager_backend.modules.notification.model.Notification;
import com.devision.job_manager_backend.modules.notification.repository.NotificationRepository;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import com.devision.job_manager_backend.modules.subscription.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class SubscriptionExpiryScheduler {

    private final SubscriptionRepository subscriptionRepository;
    private final NotificationRepository notificationRepository;

    @Scheduled(fixedRate = 10000) // daily at 02:00 AM
    public void checkCompanySubscriptionExpiry() {

        Instant now = Instant.now();

        subscriptionRepository
                .findAllByStatusAndOwnerType(
                        SubscriptionStatus.ACTIVE,
                        PayerType.COMPANY
                )
                .forEach(sub -> {

                    long daysLeft = ChronoUnit.DAYS.between(now, sub.getEndDate());

                    // 🔴 Auto-expire
                    if (daysLeft < 0) {
                        sub.setStatus(SubscriptionStatus.EXPIRED);
                        subscriptionRepository.save(sub);
                        return;
                    }

                    log.info(
                        "Checking subscription: ownerId={}, daysLeft={}",
                        sub.getOwnerId(),
                        daysLeft
                    );

                    // 🟡 Warning thresholds
                    if (daysLeft == 7 || daysLeft == 3 || daysLeft == 1) {

                        String message =
                                "Your subscription will expire in " + daysLeft + " day(s).";

                        boolean exists =
                                notificationRepository.existsByOwnerIdAndSubscriptionIdAndMessage(
                                        sub.getOwnerId(),
                                        sub.getStripeSubscriptionId(),
                                        message
                                );

                        if (exists) return;

                        notificationRepository.save(
                                Notification.builder()
                                        .ownerId(sub.getOwnerId())
                                        .ownerType(PayerType.COMPANY.name())
                                        .title("Subscription Expiring Soon")
                                        .message(message)
                                        .type("SUBSCRIPTION")
                                        .subscriptionId(sub.getStripeSubscriptionId())
                                        .read(false)
                                        .createdAt(Instant.now())
                                        .build()
                        );

                        log.info(
                                "Subscription warning sent: ownerId={}, daysLeft={}",
                                sub.getOwnerId(),
                                daysLeft
                        );
                    }
                });
    }
}
