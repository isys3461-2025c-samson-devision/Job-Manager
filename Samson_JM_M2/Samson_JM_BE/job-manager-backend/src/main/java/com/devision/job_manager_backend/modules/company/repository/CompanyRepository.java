package com.devision.job_manager_backend.modules.company.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.devision.job_manager_backend.modules.company.model.Company;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {

    Optional<Company> findByUserId(String userId);
}
