package com.devision.job_manager_backend.modules.company.controller.integration_side;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.devision.job_manager_backend.modules.company.dto.request.UpdateCompanyRequest;
import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.modules.company.repository.CompanyRepository;
import com.devision.job_manager_backend.modules.company.service.CompanyService;

@RestController
@RequestMapping("/api/integration/companies")
@RequiredArgsConstructor
public class CompanyIntegrationController {

    private final CompanyService companyService;
    private final CompanyRepository companyRepository;



    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }


    /**
     * CREATE (or get if already exists)
     * Applicant system supplies company userId
     */
    @PostMapping("/{userId}")
    public Company createOrGetCompany(@PathVariable String userId) {
        return companyService.getOrCreateMyCompany(userId);
    }

    /**
     * UPDATE
     */
    @PutMapping("/{userId}")
    public Company updateCompany(
            @PathVariable String userId,
            @RequestBody UpdateCompanyRequest request
    ) {
        return companyService.updateCompany(userId, request);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteCompany(@PathVariable String userId) {

        if (!companyRepository.existsByUserId(userId)) {
            return ResponseEntity.notFound().build();
        }

        companyRepository.deleteByUserId(userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{userId}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable String userId) {
        companyService.setActivation(userId, false);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{userId}/activate")
    public ResponseEntity<Void> activate(@PathVariable String userId) {
        companyService.setActivation(userId, true);
        return ResponseEntity.noContent().build();
    }

}
