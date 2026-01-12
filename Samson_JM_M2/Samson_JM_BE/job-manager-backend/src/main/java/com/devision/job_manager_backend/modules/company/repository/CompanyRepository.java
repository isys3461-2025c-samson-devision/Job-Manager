package com.devision.job_manager_backend.modules.company.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.devision.job_manager_backend.modules.company.model.Company;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {

    Optional<Company> findByUserId(String userId);

    boolean existsByUserId(String userId);

    Optional<Company> deleteByUserId(String userId);


    @Query("""
    {
    isActivated: true,
    $or: [
        { companyName: { $regex: ?0, $options: 'i' } },
        { aboutUs: { $regex: ?0, $options: 'i' } },
        { city: { $regex: ?0, $options: 'i' } },
        { country: { $regex: ?0, $options: 'i' } },
        { skillsNeeded: { $regex: ?0, $options: 'i' } },
        { whoWeAreLookingFor: { $regex: ?0, $options: 'i' } }
    ]
    }
    """)
    List<Company> searchCompanies(String keyword);

    
}
