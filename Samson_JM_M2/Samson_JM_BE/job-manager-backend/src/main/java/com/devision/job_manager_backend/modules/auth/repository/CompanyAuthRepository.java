package com.devision.job_manager_backend.modules.auth.repository;

import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CompanyAuthRepository
        extends MongoRepository<CompanyAuth, String> {

    Optional<CompanyAuth> findByEmail(String email);

    boolean existsByEmail(String email);
}
