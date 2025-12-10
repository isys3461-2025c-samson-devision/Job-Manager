package samson.backend.dev.company.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import samson.backend.dev.company.model.CompanyModel;

@Repository
public interface CompanyRepo extends MongoRepository<CompanyModel, Long>{
    
}
