package com.devision.job_manager_backend.modules.applicantsearch.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.devision.job_manager_backend.modules.applicantsearch.model.ApplicantSearchProfile;

public interface ApplicantSearchProfileRepository extends MongoRepository<ApplicantSearchProfile, String> {

    Optional<ApplicantSearchProfile> findByOwnerId(String ownerId);
}