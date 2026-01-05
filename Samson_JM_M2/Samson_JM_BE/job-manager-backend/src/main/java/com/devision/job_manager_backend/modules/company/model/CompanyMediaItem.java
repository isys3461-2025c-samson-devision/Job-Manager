package com.devision.job_manager_backend.modules.company.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyMediaItem {
    private String id;     // can be a UUID string
    private String type;   // "image" or "video"
    private String url;
    private String label;
}
