package com.devision.job_manager_backend.modules.applicantsearch.external.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobApplicantProfile {

    private String id;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private JsonNode birthday;
    private Boolean isPremium;
    private String name;
    private List<String> skills;
    private String summary;
    private String mediaId;
    private List<WorkExperience> workExperiences;
    private List<Education> education;
    private List<String> employmentTypes;

    private String expectedSalary;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WorkExperience {
        private String description;
        private String endDate;
        private String startDate;
        private String title;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Education {
        private Double GPA;
        private String degree;
        private String from;
        private String institution;
        private String to;
    }
}