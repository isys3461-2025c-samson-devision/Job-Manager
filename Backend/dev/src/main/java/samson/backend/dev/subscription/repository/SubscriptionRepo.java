package samson.backend.dev.subscription.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import samson.backend.dev.subscription.model.SubscriptionModel;

@Repository
public interface SubscriptionRepo extends MongoRepository<SubscriptionModel, Long>{

}
