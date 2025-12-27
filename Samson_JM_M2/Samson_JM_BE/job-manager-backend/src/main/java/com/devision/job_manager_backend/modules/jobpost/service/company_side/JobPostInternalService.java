package com.devision.job_manager_backend.modules.jobpost.service.company_side;

import com.devision.job_manager_backend.modules.jobpost.dto.request.*;
import com.devision.job_manager_backend.modules.jobpost.dto.response.*;

import java.util.List;

public interface JobPostInternalService {

    // company side
    JobPostDetailResponse createJobPost(String companyId, CreateJobPostRequest request);
    List<JobPostSummaryResponse> getCompanyJobPosts(String companyId);
    JobPostDetailResponse getCompanyJobPostDetail(String companyId, String jobPostId);
    JobPostDetailResponse updateJobPost(String companyId, String jobPostId, UpdateJobPostRequest request);
    void deleteJobPost(String companyId, String jobPostId);
    void setPublishStatus(String companyId, String jobPostId, boolean publish);


    // applicant side
    List<JobPostSummaryResponse> getPublicJobPosts(JobPostFilterRequest filter);
    JobPostDetailResponse getPublicJobPostDetail(String jobPostId);
}
