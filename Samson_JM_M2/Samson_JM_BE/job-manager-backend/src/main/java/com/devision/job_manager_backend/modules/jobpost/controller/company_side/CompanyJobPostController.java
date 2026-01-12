package com.devision.job_manager_backend.modules.jobpost.controller.company_side;

import com.devision.job_manager_backend.modules.jobpost.dto.request.CreateJobPostRequest;
import com.devision.job_manager_backend.modules.jobpost.dto.request.UpdateJobPostRequest;
import com.devision.job_manager_backend.modules.jobpost.dto.response.JobPostDetailResponse;
import com.devision.job_manager_backend.modules.jobpost.dto.response.JobPostSummaryResponse;
import com.devision.job_manager_backend.modules.jobpost.service.company_side.JobPostInternalService;
import com.devision.job_manager_backend.modules.jobpost.dto.response.JobPostApplicantResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company/jobposts")
@RequiredArgsConstructor
public class CompanyJobPostController {

    private final JobPostInternalService jobPostService;

    /* =========================
       CREATE
       ========================= */

    @PostMapping
    public ResponseEntity<JobPostDetailResponse> createJobPost(
            Authentication authentication,
            @RequestBody CreateJobPostRequest request
    ) {
        String companyId = authentication.getName();

        return ResponseEntity.ok(
                jobPostService.createJobPost(companyId, request)
        );
    }

    /* =========================
       READ (COMPANY ONLY)
       ========================= */

    // Get all job posts of the company (published + unpublished)
    @GetMapping
    public ResponseEntity<List<JobPostSummaryResponse>> getMyJobPosts(
            Authentication authentication
    ) {
        String companyId = authentication.getName();

        return ResponseEntity.ok(
                jobPostService.getCompanyJobPosts(companyId)
        );
    }

    // Get detail of one job post (ownership enforced in service)
    @GetMapping("/{jobPostId}")
    public ResponseEntity<JobPostDetailResponse> getJobPostDetail(
            Authentication authentication,
            @PathVariable String jobPostId
    ) {
        String companyId = authentication.getName();

        return ResponseEntity.ok(
                jobPostService.getCompanyJobPostDetail(companyId, jobPostId)
        );
    }

    /* =========================
       UPDATE
       ========================= */

    @PutMapping("/{jobPostId}")
    public ResponseEntity<JobPostDetailResponse> updateJobPost(
            Authentication authentication,
            @PathVariable String jobPostId,
            @RequestBody UpdateJobPostRequest request
    ) {
        String companyId = authentication.getName();

        return ResponseEntity.ok(
                jobPostService.updateJobPost(companyId, jobPostId, request)
        );
    }

    /* =========================
       DELETE
       ========================= */

    @DeleteMapping("/{jobPostId}")
    public ResponseEntity<Void> deleteJobPost(
            Authentication authentication,
            @PathVariable String jobPostId
    ) {
        String companyId = authentication.getName();

        jobPostService.deleteJobPost(companyId, jobPostId);
        return ResponseEntity.noContent().build();
    }

    /* =========================
       PUBLISH / UNPUBLISH
       ========================= */

    @PatchMapping("/{jobPostId}/publish")
    public ResponseEntity<Void> setPublishStatus(
            Authentication authentication,
            @PathVariable String jobPostId,
            @RequestParam boolean publish
    ) {
        String companyId = authentication.getName();

        jobPostService.setPublishStatus(companyId, jobPostId, publish);
        return ResponseEntity.noContent().build();
    }

    //=========================
    // APPLICANTS
    //=========================
    @GetMapping("/{jobPostId}/applicants")
public ResponseEntity<List<JobPostApplicantResponse>> getApplicantsByJobPost(
        Authentication authentication,
        @PathVariable String jobPostId
) {
    String companyId = authentication.getName();
    return ResponseEntity.ok(
            jobPostService.getApplicantsByJobPost(companyId, jobPostId)
    );
}

}
