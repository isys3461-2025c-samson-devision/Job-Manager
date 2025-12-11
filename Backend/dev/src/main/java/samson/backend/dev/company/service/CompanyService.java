package samson.backend.dev.company.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import samson.backend.dev.company.API.CompanyExternalInterface;
import samson.backend.dev.company.API.CompanyInternalInterface;
import samson.backend.dev.company.model.CompanyModel;
import samson.backend.dev.company.repository.CompanyRepo;

// add more service for interface later
@Service 
public class CompanyService implements CompanyExternalInterface, CompanyInternalInterface{
    @Autowired
    private final CompanyRepo companyRepo;

    public CompanyService(CompanyRepo companyRepo) {
        this.companyRepo = companyRepo;
    }

    public List<CompanyModel> getAllCompanies() {
        return companyRepo.findAll();
    }
    
    public CompanyModel createCompany(CompanyModel company) {
        return companyRepo.save(company);
    }
}   
