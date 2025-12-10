package samson.backend.dev.payment.model;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import org.springframework.data.annotation.Id;

@Document(collection = "payments")
public class PaymentModel {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long Id;
    private Long CompanyId;
    private String CompanyName;
    private String PaymentType;
    private Double Amount;
    private String PaymentStatus;
} 