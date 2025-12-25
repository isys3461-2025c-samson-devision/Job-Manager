package com.devision.job_manager_backend.modules.applicantsearch.repository;

import com.devision.job_manager_backend.modules.applicantsearch.model.ApplicantSearchProfile;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ApplicantSearchProfileRepository extends MongoRepository<ApplicantSearchProfile, String> {
    Optional<ApplicantSearchProfile> findByCompanyId(String companyId);
}
