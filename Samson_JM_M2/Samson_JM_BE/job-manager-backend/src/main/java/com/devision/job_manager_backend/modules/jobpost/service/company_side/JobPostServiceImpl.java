package com.devision.job_manager_backend.modules.jobpost.service.company_side;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import com.devision.job_manager_backend.modules.company.service.CompanyService;
import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.modules.jobpost.dto.request.CreateJobPostRequest;
import com.devision.job_manager_backend.modules.jobpost.dto.request.JobPostFilterRequest;
import com.devision.job_manager_backend.modules.jobpost.dto.request.UpdateJobPostRequest;
import com.devision.job_manager_backend.modules.jobpost.dto.response.JobPostDetailResponse;
import com.devision.job_manager_backend.modules.jobpost.dto.response.JobPostSummaryResponse;
import com.devision.job_manager_backend.modules.jobpost.mapper.JobPostMapper;
import com.devision.job_manager_backend.modules.jobpost.model.JobPost;
import com.devision.job_manager_backend.modules.jobpost.model.SalaryType;
import com.devision.job_manager_backend.modules.jobpost.repository.JobPostRepository;

@Service
@RequiredArgsConstructor
public class JobPostServiceImpl implements JobPostInternalService {

    private final JobPostRepository jobPostRepository;
    private final JobPostMapper jobPostMapper;
    private final CompanyService companyService;

    /* =========================
       COMPANY SIDE
       ========================= */

    @Override
    public JobPostDetailResponse createJobPost(
            String companyId,
            CreateJobPostRequest request
    ) {

        validateCreateRequest(request);

        JobPost jobPost = jobPostMapper.toEntity(request);

        Company company = companyService.getOrCreateMyCompany(companyId);


        jobPost.setCompanyId(companyId);
        jobPost.setCompanyName(company.getCompanyName());
        jobPost.setCompanyEmail(company.getEmail());
        jobPost.setPostedDate(LocalDate.now());

        return jobPostMapper.toDetail(
                jobPostRepository.save(jobPost)
        );
    }

    @Override
    public List<JobPostSummaryResponse> getCompanyJobPosts(String companyId) {

        return jobPostRepository.findByCompanyId(companyId)
                .stream()
                .map(jobPostMapper::toSummary)
                .toList();
    }

    @Override
    public JobPostDetailResponse getCompanyJobPostDetail(
            String companyId,
            String jobPostId
    ) {

        JobPost jobPost = jobPostRepository
                .findByIdAndCompanyId(jobPostId, companyId);

        if (jobPost == null) {
            throw new RuntimeException("Job post not found or not owned by company");
        }

        return jobPostMapper.toDetail(jobPost);
    }

    @Override
    public JobPostDetailResponse updateJobPost(
            String companyId,
            String jobPostId,
            UpdateJobPostRequest request
    ) {

        JobPost jobPost = jobPostRepository
                .findByIdAndCompanyId(jobPostId, companyId);

        if (jobPost == null) {
            throw new RuntimeException("Job post not found or not owned by company");
        }

        jobPostMapper.updateEntity(jobPost, request);
        jobPostRepository.save(jobPost);

        return jobPostMapper.toDetail(jobPost);
    }

    @Override
    public void deleteJobPost(String companyId, String jobPostId) {

        JobPost jobPost = jobPostRepository
                .findByIdAndCompanyId(jobPostId, companyId);

        if (jobPost == null) {
            throw new RuntimeException("Job post not found or not owned by company");
        }

        jobPostRepository.delete(jobPost);
    }

    @Override
    public void setPublishStatus(String companyId, String jobPostId, boolean publish) {

        JobPost jobPost = jobPostRepository
                .findByIdAndCompanyId(jobPostId, companyId);

        if (jobPost == null) {
            throw new RuntimeException("Job post not found or not owned by company");
        }

        jobPost.setIsPublished(publish);
        jobPostRepository.save(jobPost);
    }

    /* =========================
       APPLICANT SIDE
       ========================= */

    @Override
    public List<JobPostSummaryResponse> getPublicJobPosts(JobPostFilterRequest filter) {

        List<JobPost> jobPosts = jobPostRepository.findByIsPublishedTrue();

        if (filter != null) {

            if (filter.getLocation() != null) {
                jobPosts = jobPosts.stream()
                        .filter(jp -> jp.getLocation() != null &&
                                jp.getLocation().equalsIgnoreCase(filter.getLocation()))
                        .toList();
            }

            if (filter.getEmploymentType() != null) {
                jobPosts = jobPosts.stream()
                        .filter(jp -> jp.getEmploymentType() == filter.getEmploymentType())
                        .toList();
            }

            if (filter.getCategories() != null && !filter.getCategories().isEmpty()) {
                jobPosts = jobPosts.stream()
                        .filter(jp -> jp.getCategories() != null &&
                                jp.getCategories().stream()
                                        .anyMatch(filter.getCategories()::contains))
                        .toList();
            }

            if (filter.getTechnicalSkills() != null && !filter.getTechnicalSkills().isEmpty()) {
                jobPosts = jobPosts.stream()
                        .filter(jp -> jp.getTechnicalSkills() != null &&
                                jp.getTechnicalSkills().stream()
                                        .anyMatch(filter.getTechnicalSkills()::contains))
                        .toList();
            }
        }

        return jobPosts.stream()
                .map(jobPostMapper::toSummary)
                .toList();
    }

    @Override
    public JobPostDetailResponse getPublicJobPostDetail(String jobPostId) {

        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new RuntimeException("Job post not found"));

        if (Boolean.FALSE.equals(jobPost.getIsPublished())) {
            throw new RuntimeException("Job post is not published");
        }

        return jobPostMapper.toDetail(jobPost);
    }

    /* =========================
       VALIDATION
       ========================= */

    private void validateCreateRequest(CreateJobPostRequest request) {

        if (request.getEmploymentType() == null) {
            throw new IllegalArgumentException("Employment type is required");
        }

        if (request.getCategories() == null || request.getCategories().isEmpty()) {
            throw new IllegalArgumentException("At least one job category is required");
        }

        if (request.getSalaryType() == SalaryType.RANGE &&
            (request.getSalaryMin() == null || request.getSalaryMax() == null)) {
            throw new IllegalArgumentException("Salary range requires min and max");
        }
    }
}
