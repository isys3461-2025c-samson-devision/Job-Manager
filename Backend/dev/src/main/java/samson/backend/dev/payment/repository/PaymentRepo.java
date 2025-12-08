package samson.backend.dev.payment.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import samson.backend.dev.payment.model.PaymentModel;

@Repository
public interface PaymentRepo extends MongoRepository<PaymentModel, Long>{

    
} 