package com.devision.job_manager_backend.modules.jobpost.controller.integration_side;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.devision.job_manager_backend.modules.company.model.Company;
import com.devision.job_manager_backend.modules.jobpost.dto.request.CreateJobPostRequest;
import com.devision.job_manager_backend.modules.jobpost.dto.request.UpdateJobPostRequest;
import com.devision.job_manager_backend.modules.jobpost.model.JobPost;
import com.devision.job_manager_backend.modules.jobpost.service.company_side.JobPostServiceImpl;
import com.devision.job_manager_backend.modules.jobpost.repository.JobPostRepository;


@RestController
@RequestMapping("/api/integration/job-posts")
@RequiredArgsConstructor
public class JobPostIntegrationController {

    private final JobPostServiceImpl jobPostServiceImpl;
    private final JobPostRepository jobPostRepository;



    /**
     * ✅ GET ALL job posts (admin view)
     */
    @GetMapping
    public List<JobPost> getAllJobPosts() {
        return jobPostRepository.findAll();
    }

    /**
     * CREATE job post for a company
     */
    @PostMapping("/{companyId}")
    public void createJobPost(
            @PathVariable String companyId,
            @RequestBody CreateJobPostRequest request
    ) {
        jobPostServiceImpl.createJobPost(companyId, request);
    }

    /**
     * UPDATE job post
     */
    @PutMapping("/{companyId}/{jobPostId}")
    public void updateJobPost(
            @PathVariable String companyId,
            @PathVariable String jobPostId,
            @RequestBody UpdateJobPostRequest request
    ) {
        jobPostServiceImpl.updateJobPost(companyId, jobPostId, request);
    }

    /**
     * DELETE job post
     */
    @DeleteMapping("/{companyId}/{jobPostId}")
    public void deleteJobPost(
            @PathVariable String companyId,
            @PathVariable String jobPostId
    ) {
        jobPostServiceImpl.deleteJobPost(companyId, jobPostId);
    }
}
