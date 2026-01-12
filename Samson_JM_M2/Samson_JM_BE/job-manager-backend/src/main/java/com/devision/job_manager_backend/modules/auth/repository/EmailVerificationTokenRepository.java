package com.devision.job_manager_backend.modules.auth.repository;

import com.devision.job_manager_backend.modules.auth.model.EmailVerificationToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface EmailVerificationTokenRepository
        extends MongoRepository<EmailVerificationToken, String> {

        Optional<EmailVerificationToken> findByToken(String token);


        void deleteByToken(String token);


}

