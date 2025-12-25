package com.devision.job_manager_backend.modules.subscription.service.external.impl;

import com.devision.job_manager_backend.modules.subscription.model.SubscriptionPlan;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import com.devision.job_manager_backend.modules.subscription.repository.SubscriptionRepository;
import com.devision.job_manager_backend.modules.subscription.service.external.SubscriptionExternalService;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionExternalServiceImpl implements SubscriptionExternalService {
    private final SubscriptionRepository subscriptionRepository;

    @Override
    public boolean isPremiumActive(String companyId) {
        return subscriptionRepository.findByCompanyId(companyId)
            .filter(sub -> sub.getPlan() == SubscriptionPlan.PREMIUM)
            .filter(sub -> sub.getStatus() == SubscriptionStatus.ACTIVE)
            .filter(sub -> sub.getEndDate() == null
                || sub.getEndDate().isAfter(LocalDateTime.now(ZoneOffset.UTC)))
            .isPresent();
    }
}
