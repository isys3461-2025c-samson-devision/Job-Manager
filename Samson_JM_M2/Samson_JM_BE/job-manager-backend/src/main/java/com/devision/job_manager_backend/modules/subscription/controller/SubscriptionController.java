package com.devision.job_manager_backend.modules.subscription.controller;

import com.devision.job_manager_backend.modules.subscription.DTO.request.ConfirmSubscriptionRequest;
import com.devision.job_manager_backend.modules.subscription.DTO.response.SubscriptionStatusResponse;
import com.devision.job_manager_backend.modules.subscription.service.SubscriptionNotificationScheduler;
import com.devision.job_manager_backend.modules.subscription.service.SubscriptionService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final SubscriptionNotificationScheduler notificationScheduler;

    @GetMapping("/current")
    public ResponseEntity<SubscriptionStatusResponse> current() {
        String companyId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        return ResponseEntity.ok(subscriptionService.getCurrentStatus(companyId));
    }

    @PostMapping("/confirm")
    public ResponseEntity<SubscriptionStatusResponse> confirm(
        @Valid @RequestBody ConfirmSubscriptionRequest request
    ) {
        String companyId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        return ResponseEntity.ok(subscriptionService.confirmPremium(companyId, request));
    }

    @PostMapping("/cancel")
    public ResponseEntity<SubscriptionStatusResponse> cancel() {
        String companyId = (String) SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
        return ResponseEntity.ok(subscriptionService.cancel(companyId));
    }

    @PostMapping("/notifications/run")
    public ResponseEntity<Map<String, String>> runNotifications() {
        notificationScheduler.runNotifications();
        return ResponseEntity.ok(Map.of("message", "Notifications executed"));
    }
}
