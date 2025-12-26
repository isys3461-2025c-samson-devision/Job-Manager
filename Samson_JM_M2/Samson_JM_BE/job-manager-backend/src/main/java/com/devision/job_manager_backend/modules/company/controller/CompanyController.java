package com.devision.job_manager_backend.modules.company.controller;
import com.devision.job_manager_backend.modules.company.mapper.CurrentUserUtil;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.devision.job_manager_backend.modules.company.dto.request.CompanyProfileUpdateRequest;
import com.devision.job_manager_backend.modules.company.dto.response.CompanyProfileResponse;
import com.devision.job_manager_backend.modules.company.dto.response.CompanyPublicProfileResponse;
import com.devision.job_manager_backend.modules.company.service.CompanyService;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping("/me")
    public ResponseEntity<CompanyProfileResponse> getMyProfile() {
        String companyId = CurrentUserUtil.getCurrentUserId();
        CompanyProfileResponse res = companyService.getMyProfile(companyId);
        return ResponseEntity.ok(res);
    }

    @PatchMapping("/me")
    public ResponseEntity<CompanyProfileResponse> patchMyProfile(@Valid @RequestBody CompanyProfileUpdateRequest req) {
        String companyId = CurrentUserUtil.getCurrentUserId();
        CompanyProfileResponse res = companyService.updateMyProfile(companyId, req);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{companyId}/public")
    public ResponseEntity<CompanyPublicProfileResponse> getPublicProfile(@PathVariable String companyId) {
        CompanyPublicProfileResponse res = companyService.getPublicProfile(companyId);
        return ResponseEntity.ok(res);
    }
}


