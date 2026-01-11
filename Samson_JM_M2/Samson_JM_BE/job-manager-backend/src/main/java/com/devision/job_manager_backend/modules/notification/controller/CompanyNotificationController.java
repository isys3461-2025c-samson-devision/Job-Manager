package com.devision.job_manager_backend.modules.notification.controller;

import com.devision.job_manager_backend.modules.notification.model.Notification;
import com.devision.job_manager_backend.modules.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications/company")
@RequiredArgsConstructor
public class CompanyNotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    public List<Notification> getMyNotifications(Authentication auth) {
        return notificationService.getByOwnerId(auth.getName());
    }

    @GetMapping("/my/unread-count")
    public long getUnreadCount(Authentication auth) {
        return notificationService.countUnread(auth.getName());
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
    }
}
