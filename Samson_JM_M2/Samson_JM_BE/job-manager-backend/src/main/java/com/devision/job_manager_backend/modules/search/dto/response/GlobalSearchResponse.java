package com.devision.job_manager_backend.modules.search.dto.response;

import java.util.List;
import com.devision.job_manager_backend.modules.search.dto.request.CompanySearchResult;;
import com.devision.job_manager_backend.modules.search.dto.request.JobPostSearchResult;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GlobalSearchResponse {
    private List<CompanySearchResult> companies;
    private List<JobPostSearchResult> jobPosts;
}
