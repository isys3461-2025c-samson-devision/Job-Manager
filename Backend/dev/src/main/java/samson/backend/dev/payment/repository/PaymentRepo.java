package samson.backend.dev.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import samson.backend.dev.payment.model.PaymentModel;

@Repository
public interface PaymentRepo extends JpaRepository<PaymentModel, Long>{

    
} 