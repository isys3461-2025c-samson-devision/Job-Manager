package com.devision.job_manager_backend.modules.jobpost.mapper;

import com.devision.job_manager_backend.modules.jobpost.dto.request.CreateJobPostRequest;
import com.devision.job_manager_backend.modules.jobpost.dto.request.UpdateJobPostRequest;
import com.devision.job_manager_backend.modules.jobpost.dto.response.JobPostDetailResponse;
import com.devision.job_manager_backend.modules.jobpost.dto.response.JobPostSummaryResponse;
import com.devision.job_manager_backend.modules.jobpost.model.JobPost;
import com.devision.job_manager_backend.modules.company.model.Company;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class JobPostMapper {

    /* =========================
       CREATE
       ========================= */

    public JobPost toEntity(CreateJobPostRequest request) {
        JobPost jobPost = new JobPost();

        jobPost.setTitle(request.getTitle());
        jobPost.setDescription(request.getDescription());
        jobPost.setLocation(request.getLocation());

        jobPost.setEmploymentType(request.getEmploymentType());
        jobPost.setCategories(request.getCategories());

        jobPost.setExpiryDate(request.getExpiryDate());

        jobPost.setSalaryType(request.getSalaryType());
        jobPost.setSalaryMin(request.getSalaryMin());
        jobPost.setSalaryMax(request.getSalaryMax());

        jobPost.setTechnicalSkills(request.getTechnicalSkills());

        jobPost.setIsPublished(
                request.getIsPublished() != null ? request.getIsPublished() : true
        );

        jobPost.setPostedDate(LocalDate.now());

        return jobPost;
    }

    /* =========================
       UPDATE (PARTIAL)
       ========================= */

    public void updateEntity(JobPost jobPost, UpdateJobPostRequest request) {

        jobPost.setFresher_flag(
                request.getFresherFlag() != null ? request.getFresherFlag() : false
        );

        if (request.getTitle() != null) {
            jobPost.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            jobPost.setDescription(request.getDescription());
        }

        if (request.getLocation() != null) {
            jobPost.setLocation(request.getLocation());
        }

        if (request.getEmploymentType() != null) {
            jobPost.setEmploymentType(request.getEmploymentType());
        }

        if (request.getCategories() != null) {
            jobPost.setCategories(request.getCategories());
        }

        if (request.getExpiryDate() != null) {
            jobPost.setExpiryDate(request.getExpiryDate());
        }

        if (request.getSalaryType() != null) {
            jobPost.setSalaryType(request.getSalaryType());
        }

        if (request.getSalaryMin() != null) {
            jobPost.setSalaryMin(request.getSalaryMin());
        }

        if (request.getSalaryMax() != null) {
            jobPost.setSalaryMax(request.getSalaryMax());
        }

        if (request.getTechnicalSkills() != null) {
            jobPost.setTechnicalSkills(request.getTechnicalSkills());
        }

        if (request.getIsPublished() != null) {
            jobPost.setIsPublished(request.getIsPublished());
        }
    }

    /* =========================
       RESPONSE MAPPING
       ========================= */

    public JobPostSummaryResponse toSummary(JobPost jobPost) {
        return new JobPostSummaryResponse(
                jobPost.getCompanyId(),
                jobPost.getCompanyName(),
                jobPost.getCompanyEmail(),
                jobPost.getId(),
                jobPost.getTitle(),
                jobPost.getDescription(),
                jobPost.getLocation(),
                jobPost.getEmploymentType(),
                jobPost.getCategories(),
                jobPost.getSalaryType(),
                jobPost.getSalaryMin(),
                jobPost.getSalaryMax(),
                jobPost.getTechnicalSkills(),
                jobPost.getExpiryDate(),
                jobPost.getPostedDate(),
                jobPost.getIsPublished()
        );
    }

    public JobPostDetailResponse toDetail(JobPost jobPost) {
        return new JobPostDetailResponse(
                jobPost.getId(),
                jobPost.getCompanyId(),
                jobPost.getCompanyName(),
                jobPost.getCompanyEmail(),
                jobPost.getTitle(),
                jobPost.getDescription(),
                jobPost.getLocation(),
                jobPost.getEmploymentType(),
                jobPost.getCategories(),
                jobPost.getPostedDate(),
                jobPost.getExpiryDate(),
                jobPost.getSalaryType(),
                jobPost.getSalaryMin(),
                jobPost.getSalaryMax(),
                jobPost.getTechnicalSkills(),
                jobPost.getIsPublished()
        );
    
    }
}