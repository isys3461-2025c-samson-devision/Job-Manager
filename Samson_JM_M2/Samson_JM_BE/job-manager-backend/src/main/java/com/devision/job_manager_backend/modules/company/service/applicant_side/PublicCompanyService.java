package com.devision.job_manager_backend.modules.company.service.applicant_side;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.devision.job_manager_backend.modules.company.dto.response.applicant_side.PublicCompanyDetailResponse;
import com.devision.job_manager_backend.modules.company.dto.response.applicant_side.PublicCompanySummaryResponse;
import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.modules.company.repository.CompanyRepository;

@Service
@RequiredArgsConstructor
public class PublicCompanyService {

    private final CompanyRepository companyRepository;

    public List<PublicCompanySummaryResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
            .map(c -> new PublicCompanySummaryResponse(
                c.getId(),
                c.getUserId(),
                c.getCompanyName(),
                c.getEmail(),
                c.getLogoUrl(),
                c.getCity(),
                c.getCountry()
            ))
            .toList();
    }

    public PublicCompanyDetailResponse getCompanyById(String companyId) {
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new RuntimeException("Company not found"));

        return new PublicCompanyDetailResponse(
            company.getId(),
            company.getUserId(),
            company.getCompanyName(),
            company.getEmail(),
            company.getAboutUs(),
            company.getWhoWeAreLookingFor(),
            company.getLogoUrl(),
            company.getCity(),
            company.getCountry()
        );
    }
}
