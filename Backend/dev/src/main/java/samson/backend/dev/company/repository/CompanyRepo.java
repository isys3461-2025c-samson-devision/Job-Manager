package samson.backend.dev.company.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import samson.backend.dev.company.model.CompanyModel;

@Repository
public interface CompanyRepo extends MongoRepository<CompanyModel, String> {
    CompanyModel findByCompanyId(String companyId);

    CompanyModel findByCompanyEmail(String companyEmail);

    CompanyModel findByCompanyPhone(String companyPhone);

    List<CompanyModel> findByCompanyName(String companyName);

    List<CompanyModel> findByCompanyCity(String companyCity);

    List<CompanyModel> findByCompanyCountry(String companyCountry);

    List<CompanyModel> findByCompanySubscriptionStatus(String companySubscriptionStatus);
}
