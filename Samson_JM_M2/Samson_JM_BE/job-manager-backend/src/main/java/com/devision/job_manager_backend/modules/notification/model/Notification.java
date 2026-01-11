package com.devision.job_manager_backend.modules.notification.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@Document("notifications")
public class Notification {

    @Id
    private String id;

    private String ownerId;
    private String ownerType; // COMPANY
    private String title;
    private String message;
    private String type; // SUBSCRIPTION
    private String subscriptionId; // subscriptionId
    private boolean read;
    private Instant createdAt;
}
