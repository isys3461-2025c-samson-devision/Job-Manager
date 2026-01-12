package com.devision.job_manager_backend.modules.search.service;

import java.util.List;
import com.devision.job_manager_backend.modules.company.repository.CompanyRepository;
import com.devision.job_manager_backend.modules.jobpost.repository.JobPostRepository;
import com.devision.job_manager_backend.modules.search.dto.request.CompanySearchResult;
import com.devision.job_manager_backend.modules.search.dto.request.JobPostSearchResult;
import com.devision.job_manager_backend.modules.search.dto.response.GlobalSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class GlobalSearchService {

    private final CompanyRepository companyRepository;
    private final JobPostRepository jobPostRepository;

    public GlobalSearchResponse search(String keyword) {

        var companies = companyRepository.searchCompanies(keyword)
            .stream()
            .map(c -> CompanySearchResult.builder()
                .companyId(c.getId())
                .companyName(c.getCompanyName())
                .city(c.getCity())
                .country(c.getCountry())
                .skillsNeeded(c.getSkillsNeeded())
                .build()
            )
            .toList();

        var jobPosts = jobPostRepository.searchJobPosts(keyword)
            .stream()
            .map(j -> JobPostSearchResult.builder()
                .jobPostId(j.getId())
                .title(j.getTitle())
                .companyName(j.getCompanyName())
                .location(j.getLocation())
                .technicalSkills(j.getTechnicalSkills())
                .employmentType(j.getEmploymentType().name())
                .salaryMin(j.getSalaryMin())
                .salaryMax(j.getSalaryMax())
                .build()
            )
            .toList();

        return GlobalSearchResponse.builder()
            .companies(companies)
            .jobPosts(jobPosts)
            .build();
    }
}

