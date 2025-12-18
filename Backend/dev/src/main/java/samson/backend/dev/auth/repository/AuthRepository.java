package samson.backend.dev.auth.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import samson.backend.dev.auth.model.AuthModel;
import java.util.Optional;


@Repository
public interface AuthRepository extends MongoRepository<AuthModel, String>{
    Optional<AuthModel> findByEmail(String email);
}
