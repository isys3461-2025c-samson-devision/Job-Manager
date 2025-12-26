package com.devision.job_manager_backend.modules.company.service;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.devision.job_manager_backend.modules.company.dto.request.CompanyProfileUpdateRequest;
import com.devision.job_manager_backend.modules.company.dto.response.CompanyProfileResponse;
import com.devision.job_manager_backend.modules.company.dto.response.CompanyPublicProfileResponse;
import com.devision.job_manager_backend.modules.company.mapper.CompanyMapper;
import com.devision.job_manager_backend.modules.company.model.CompanyProfile;
import com.devision.job_manager_backend.modules.company.repository.CompanyRepository;
import com.devision.job_manager_backend.modules.company.service.CompanyService;
import com.devision.job_manager_backend.common.exception.NotFoundException;


@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public CompanyProfileResponse getMyProfile(String companyId) {
        CompanyProfile profile = companyRepository.findById(companyId).orElseGet(() -> {
            CompanyProfile p = new CompanyProfile(companyId);
            Instant now = Instant.now();
            p.setCreatedAt(now);
            p.setUpdatedAt(now);
            return companyRepository.save(p);
        });

        return CompanyMapper.toProfileResponse(profile);
    }

@Override
public CompanyProfileResponse updateMyProfile(String companyId, CompanyProfileUpdateRequest req) {

    CompanyProfile profile = companyRepository.findById(companyId).orElseGet(() -> {
        CompanyProfile p = new CompanyProfile(companyId);
        Instant now = Instant.now();
        p.setCreatedAt(now);
        p.setUpdatedAt(now);
        return p;
    });

    if (req.getName() != null) profile.setName(req.getName());
    if (req.getPhone() != null) profile.setPhone(req.getPhone());
    if (req.getStreet() != null) profile.setStreet(req.getStreet());
    if (req.getCity() != null) profile.setCity(req.getCity());
    if (req.getCountry() != null) profile.setCountry(req.getCountry());
    if (req.getAboutUs() != null) profile.setAboutUs(req.getAboutUs());
    if (req.getWhoWeAreLookingFor() != null) profile.setWhoWeAreLookingFor(req.getWhoWeAreLookingFor());

    profile.setUpdatedAt(Instant.now());

    CompanyProfile saved = companyRepository.save(profile);
    return CompanyMapper.toProfileResponse(saved);
}

@Override
public CompanyPublicProfileResponse getPublicProfile(String companyId) {
    CompanyProfile profile = companyRepository.findById(companyId)
        .orElseThrow(() -> new NotFoundException("Company public profile not found"));
    return CompanyMapper.toPublicResponse(profile);
}
}
