package com.devision.job_manager_backend.modules.applicantsearch.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApplicantSearchResult {

    private String id;
    private String name;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private String title;
    private Double rating;
    private Integer yearsExperience;
    private List<EducationResponse> education;
    private List<String> skills;
    private String summary;
    private List<WorkExperienceResponse> workExperiences;
    private String expectedSalary;
    private String availability;
    private String avatarUrl;
    private String mediaId;
    private List<String> employmentTypes;

    @Getter
    @AllArgsConstructor
    public static class EducationResponse {
        private Double GPA;
        private String degree;
        private String from;
        private String institution;
        private String to;
    }

    @Getter
    @AllArgsConstructor
    public static class WorkExperienceResponse {
        private String description;
        private String endDate;
        private String startDate;
        private String title;
    }
}
