package com.devision.job_manager_backend.modules.company.controller.applicant_side;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.devision.job_manager_backend.modules.company.dto.response.applicant_side.PublicCompanyDetailResponse;
import com.devision.job_manager_backend.modules.company.dto.response.applicant_side.PublicCompanySummaryResponse;
import com.devision.job_manager_backend.modules.company.service.applicant_side.PublicCompanyService;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class PublicCompanyController {

    private final PublicCompanyService publicCompanyService;

    @GetMapping
    public List<PublicCompanySummaryResponse> getCompanies() {
        return publicCompanyService.getAllCompanies();
    }

    @GetMapping("/{companyId}")
    public PublicCompanyDetailResponse getCompany(
            @PathVariable String companyId
    ) {
        
        return publicCompanyService.getCompanyById(companyId);
    }
}
