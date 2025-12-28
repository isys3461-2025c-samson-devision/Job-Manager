package com.devision.job_manager_backend.modules.subscription.service.impl.subscription;

import com.devision.job_manager_backend.modules.subscription.service.internal.ApplicantSubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicantSubscriptionServiceImpl implements ApplicantSubscriptionService {

    @Override
    public void activateApplicantSubscription(String applicantEmail) {

        /**
         * IMPORTANT:
         * Job Manager does NOT own Applicant subscription state.
         * This method only delegates activation responsibility.
         *
         * In Milestone 2:
         * - Replace this with REST call to Job Applicant system
         *   OR Kafka event publish
         */

        log.info(
                "[ApplicantSubscription] Payment successful. Delegating premium activation for applicant: {}",
                applicantEmail
        );

        // TODO (Milestone 2):
        // call Job Applicant API OR publish Kafka event
    }
}
