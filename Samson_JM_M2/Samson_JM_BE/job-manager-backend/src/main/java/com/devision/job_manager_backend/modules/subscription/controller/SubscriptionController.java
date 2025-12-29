package com.devision.job_manager_backend.modules.subscription.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devision.job_manager_backend.modules.subscription.dto.external.subscription.SubscriptionResponse;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionStatus;
import com.devision.job_manager_backend.modules.subscription.service.internal.SubscriptionService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/me")
    public ResponseEntity<SubscriptionResponse> getMySubscription(
            Authentication authentication
    ) {
        String email = (String) authentication.getDetails();

        SubscriptionResponse response = subscriptionService
                .getCurrentSubscription(email)
                .map(this::toResponse)
                .orElseGet(this::freeResponse);

        return ResponseEntity.ok(response);
    }

    /* =========================
       Helpers
       ========================= */

    private SubscriptionResponse toResponse(SubscriptionModel sub) {
        boolean isPremium = subscriptionService.isPremium(sub);

        SubscriptionResponse response = new SubscriptionResponse();
        response.setStatus(sub.getStatus());
        response.setStartDate(sub.getStartDate());
        response.setEndDate(sub.getEndDate());
        response.setPremium(isPremium);
        return response;
    }

    private SubscriptionResponse freeResponse() {
        SubscriptionResponse response = new SubscriptionResponse();
        response.setStatus(SubscriptionStatus.EXPIRED);
        response.setStartDate(null);
        response.setEndDate(null);
        response.setPremium(false);
        return response;
    }
}
