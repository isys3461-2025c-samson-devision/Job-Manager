package com.devision.job_manager_backend.modules.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.devision.job_manager_backend.modules.company.repo.CompanyRepository;
import com.devision.job_manager_backend.modules.company.model.CompanyModel;
import java.util.List;

@Service
public class CompanyService{
    @Autowired
    private CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<CompanyModel> findAll() {
        return companyRepository.findAll();
    }

    public CompanyModel save(CompanyModel company) {
        return companyRepository.save(company);
    }

    public CompanyModel findById(String id) {
        return companyRepository.findById(id).orElse(null);
    }

    public void deleteById(String id) {
        companyRepository.deleteById(id);
    }

    public CompanyModel updateCompany(String id, CompanyModel updatedCompany) {
        return companyRepository.findById(id).map(company -> {
            company.setCompanyName(updatedCompany.getCompanyName());
            company.setAddress(updatedCompany.getAddress());
            company.setCompanyPhone(updatedCompany.getCompanyPhone());
            company.setCompanyCountry(updatedCompany.getCompanyCountry());
            company.setCompanyCity(updatedCompany.getCompanyCity());
            company.setCompanyAbout(updatedCompany.getCompanyAbout());
            company.setCompanyTitle(updatedCompany.getCompanyTitle());
            company.setCompanyMedia(updatedCompany.getCompanyMedia());
            company.setCompanySkillsNeeded(updatedCompany.getCompanySkillsNeeded());
            company.setCompanyAchievements(updatedCompany.getCompanyAchievements());
            company.setCompanySubscriptionStatus(updatedCompany.getCompanySubscriptionStatus());
            company.setCompanyLogo(updatedCompany.getCompanyLogo());
            return companyRepository.save(company);
        }).orElse(null);
    }

    public CompanyModel findByUsername(String username) {
        return companyRepository.findByUsername(username);
    }

    public CompanyModel findByEmail(String email) {
        return companyRepository.findByEmail(email);
    }

    
}
