package com.devision.job_manager_backend.modules.jobpost.controller.integration_side;

import java.time.Instant;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationByJobResponse {
    private boolean success;
    private List<ApplicationItem> data;

    @Getter
    @Setter
    public static class ApplicationItem {
        private String id;
        private String authId;
        private String jobId;
        private String companyId;
        private String status;
        private String createdAt;


        private String cvUrl;
        private String coverLetterUrl;
    }
}
