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

@Service
@RequiredArgsConstructor
public class CompanySubscriptionServiceImpl implements CompanySubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    @Override
    public void activateCompanySubscription(String companyEmail) {

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

        // 2. Create new subscription
        SubscriptionModel newSubscription = SubscriptionModel.builder()
                .ownerEmail(companyEmail)
                .ownerType(PayerType.COMPANY)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(30))
                .status(SubscriptionStatus.ACTIVE)
                .build();

        subscriptionRepository.save(newSubscription);
    }
}
