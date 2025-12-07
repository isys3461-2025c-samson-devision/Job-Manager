package samson.backend.dev.jobpost.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import samson.backend.dev.jobpost.model.JobPostModel;

@Repository
public interface JobPostRepo extends JpaRepository<JobPostModel,Long> {
    
}
