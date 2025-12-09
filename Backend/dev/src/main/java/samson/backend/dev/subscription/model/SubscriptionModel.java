package samson.backend.dev.subscription.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subscriptions")
public class SubscriptionModel {
    @Id
    private String Id;
}
