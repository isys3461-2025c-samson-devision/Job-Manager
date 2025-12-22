package com.devision.job_manager_backend.modules.company.mapper;

import com.devision.job_manager_backend.modules.company.dto.response.CompanyProfileResponse;
import com.devision.job_manager_backend.modules.company.dto.response.CompanyPublicProfileResponse;
import com.devision.job_manager_backend.modules.company.model.CompanyProfile;

public class CompanyMapper {

    private CompanyMapper() {
    }

    public static CompanyProfileResponse toProfileResponse(CompanyProfile p) {
        CompanyProfileResponse r = new CompanyProfileResponse();
        r.setCompanyId(p.getId());
        r.setName(p.getName());
        r.setPhone(p.getPhone());
        r.setStreet(p.getStreet());
        r.setCity(p.getCity());
        r.setCountry(p.getCountry());
        r.setAboutUs(p.getAboutUs());
        r.setWhoWeAreLookingFor(p.getWhoWeAreLookingFor());
        r.setLogoUrl(p.getLogoUrl());
        return r;
    }

    public static CompanyPublicProfileResponse toPublicResponse(CompanyProfile p) {
        CompanyPublicProfileResponse r = new CompanyPublicProfileResponse();
        r.setCompanyId(p.getId());
        r.setName(p.getName());
        r.setAboutUs(p.getAboutUs());
        r.setWhoWeAreLookingFor(p.getWhoWeAreLookingFor());
        r.setCity(p.getCity());
        r.setCountry(p.getCountry());
        r.setLogoUrl(p.getLogoUrl());
        return r;
    }
}
