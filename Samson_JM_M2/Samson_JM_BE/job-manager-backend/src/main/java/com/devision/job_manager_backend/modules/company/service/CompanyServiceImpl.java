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
            p.setCreatedAt(Instant.now());
            return p;
        });

        profile.setName(req.getName());
        profile.setPhone(req.getPhone());
        profile.setStreet(req.getStreet());
        profile.setCity(req.getCity());
        profile.setCountry(req.getCountry());
        profile.setAboutUs(req.getAboutUs());
        profile.setWhoWeAreLookingFor(req.getWhoWeAreLookingFor());
        profile.setUpdatedAt(Instant.now());

        CompanyProfile saved = companyRepository.save(profile);
        return CompanyMapper.toProfileResponse(saved);
    }

    @Override
    public CompanyPublicProfileResponse getPublicProfile(String companyId) {
        CompanyProfile profile = companyRepository.findById(companyId).orElse(null);
        if (profile == null) {
            CompanyProfile empty = new CompanyProfile(companyId);
            return CompanyMapper.toPublicResponse(empty);
        }
        return CompanyMapper.toPublicResponse(profile);
    }
}
