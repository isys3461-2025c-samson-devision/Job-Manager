package com.devision.job_manager_backend.modules.company.repo;
import com.devision.job_manager_backend.modules.company.model.CompanyModel;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends MongoRepository<CompanyModel, String> {
    CompanyModel findByEmail(String email);
    CompanyModel findByUsername(String username);
    CompanyModel findByCompanyName(String companyName);

    List<CompanyModel> findByCompanyCountry(String companyCountry);
    List<CompanyModel> findByCompanyCity(String companyCity);
    List<CompanyModel> findByCompanySkillsNeededIn(List<String> skills);
    List<CompanyModel> findByCompanySubscriptionStatus(String status);
    
    CompanyModel deleteByCompanyName(String companyName);
    CompanyModel deleteByEmail(String email);
    CompanyModel deleteByUsername(String username);
}
