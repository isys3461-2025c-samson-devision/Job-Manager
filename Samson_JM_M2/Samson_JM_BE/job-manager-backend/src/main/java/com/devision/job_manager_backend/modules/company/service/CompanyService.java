package com.devision.job_manager_backend.modules.company.service;

import com.devision.job_manager_backend.modules.company.dto.request.CompanyProfileUpdateRequest;
import com.devision.job_manager_backend.modules.company.dto.response.CompanyProfileResponse;
import com.devision.job_manager_backend.modules.company.dto.response.CompanyPublicProfileResponse;

public interface CompanyService {

    CompanyProfileResponse getMyProfile(String companyId);

    CompanyProfileResponse updateMyProfile(String companyId, CompanyProfileUpdateRequest req);

    CompanyPublicProfileResponse getPublicProfile(String companyId);
}

