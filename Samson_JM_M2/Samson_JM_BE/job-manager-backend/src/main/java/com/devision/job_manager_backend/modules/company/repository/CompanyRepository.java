package com.devision.job_manager_backend.modules.company.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.devision.job_manager_backend.modules.company.model.CompanyProfile;

public interface CompanyRepository extends MongoRepository<CompanyProfile, String> {
}

