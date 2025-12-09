package samson.backend.dev.payment.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document(collection = "payments")
public class PaymentModel {
    @Id
    private String Id;
    
} 