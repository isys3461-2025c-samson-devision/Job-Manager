package com.devision.job_manager_backend.modules.notification.service;

import com.devision.job_manager_backend.modules.notification.model.Notification;
import com.devision.job_manager_backend.modules.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public List<Notification> getByOwnerId(String ownerId) {
        return repository.findByOwnerIdOrderByCreatedAtDesc(ownerId);
    }

    public long countUnread(String ownerId) {
        return repository.countByOwnerIdAndReadFalse(ownerId);
    }

    public void markAsRead(String notificationId) {
        repository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            repository.save(n);
        });
    }
}
