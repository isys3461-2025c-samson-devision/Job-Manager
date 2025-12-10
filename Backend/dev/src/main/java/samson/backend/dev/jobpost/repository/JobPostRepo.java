package samson.backend.dev.jobpost.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import samson.backend.dev.jobpost.model.JobPostModel;

@Repository
public interface JobPostRepo extends MongoRepository<JobPostModel, Long> {
    
}
