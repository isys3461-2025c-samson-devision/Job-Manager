package com.devision.job_manager_backend.modules.subscription.service;

import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import com.devision.job_manager_backend.modules.subscription.repository.SubscriptionRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SubscriptionNotificationScheduler {
    private static final int EXPIRY_WARNING_DAYS = 7;

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionEmailService subscriptionEmailService;

    @Scheduled(cron = "0 0 9 * * *")
    public void runNotifications() {
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        LocalDateTime warningStart = now.plusDays(EXPIRY_WARNING_DAYS);
        LocalDateTime warningEnd = warningStart.plusDays(1);

        List<SubscriptionModel> expiringSoon =
            subscriptionRepository.findByStatusAndEndDateBetween(
                SubscriptionStatus.ACTIVE,
                warningStart,
                warningEnd
            );

        for (SubscriptionModel subscription : expiringSoon) {
            if (subscription.getEndDate() == null || subscription.isPreExpiryNotified()) {
                continue;
            }

            subscriptionEmailService.sendExpiryWarning(subscription);
            subscription.setPreExpiryNotified(true);
            subscription.setUpdatedAt(now);
            subscriptionRepository.save(subscription);
        }

        List<SubscriptionModel> expired =
            subscriptionRepository.findByStatusAndEndDateBefore(
                SubscriptionStatus.ACTIVE,
                now
            );

        for (SubscriptionModel subscription : expired) {
            if (subscription.getEndDate() == null || subscription.isExpiredNotified()) {
                continue;
            }

            subscription.setStatus(SubscriptionStatus.EXPIRED);
            subscription.setExpiredNotified(true);
            subscription.setUpdatedAt(now);
            subscriptionRepository.save(subscription);
            subscriptionEmailService.sendExpiredNotice(subscription);
        }
    }
}
