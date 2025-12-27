package com.devision.job_manager_backend.modules.jobpost.controller.applicant_side;

import com.devision.job_manager_backend.modules.jobpost.dto.request.JobPostFilterRequest;
import com.devision.job_manager_backend.modules.jobpost.dto.response.JobPostDetailResponse;
import com.devision.job_manager_backend.modules.jobpost.dto.response.JobPostSummaryResponse;
import com.devision.job_manager_backend.modules.jobpost.service.company_side.JobPostInternalService;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobposts")
@RequiredArgsConstructor
public class PublicJobPostController {

    private final JobPostInternalService jobPostService;

    @GetMapping
    public List<JobPostSummaryResponse> getPublicJobs(JobPostFilterRequest filter) {
        return jobPostService.getPublicJobPosts(filter);
    }

    @GetMapping("/{id}")
    public JobPostDetailResponse getDetail(@PathVariable String id) {
        return jobPostService.getPublicJobPostDetail(id);
    }
}

