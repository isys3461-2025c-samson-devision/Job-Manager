package samson.backend.dev.subscription.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subscriptions")
public class SubscriptionModel {
    @Id
    private String Id;
    private String companyId;
    private LocalDate startDate;
    private LocalDate endDate;
    private double price;
    private SubscriptionStatus status;
}
