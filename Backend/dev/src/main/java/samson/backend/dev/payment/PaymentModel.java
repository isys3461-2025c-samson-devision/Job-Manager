package samson.backend.dev.payment;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class PaymentModel {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long Id;
    
} 