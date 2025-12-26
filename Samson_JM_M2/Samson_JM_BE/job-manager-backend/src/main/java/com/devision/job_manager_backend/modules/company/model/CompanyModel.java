package com.devision.job_manager_backend.modules.company.model;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.devision.job_manager_backend.common.CommonUser;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "companies")
@Getter
@Setter
public class CompanyModel extends CommonUser {

    @NotBlank
    private String companyName;
    @NotBlank
    private String address;
    @NotBlank
    private String companyPhone;
    @NotBlank
    private String companyCountry;
    @NotBlank
    private String companyCity;
    private String companyAbout;
    private String companyTitle;
    private List<CompanyMedia> companyMedia;
    @NotBlank
    private List<String> companySkillsNeeded;
    @NotBlank
    private List<CompanyAchievement> companyAchievements;
    @NotBlank
    private String companySubscriptionStatus;
    private String companyLogo;

    public CompanyModel(String id, String username, String email, String password, String companyName, String address, String companyPhone, String companyCountry, String companyCity, String companyAbout, String companyTitle, List<CompanyMedia> companyMedia, List<String> companySkillsNeeded, List<CompanyAchievement> companyAchievements, String companySubscriptionStatus, String companyLogo) {
        super(id, username, email, password);
        this.companyName = companyName;
        this.address = address;
        this.companyPhone = companyPhone;
        this.companyCountry = companyCountry;
        this.companyCity = companyCity;
        this.companyAbout = companyAbout;
        this.companyTitle = companyTitle;
        this.companyMedia = companyMedia;
        this.companySkillsNeeded = companySkillsNeeded;
        this.companyAchievements = companyAchievements;
        this.companySubscriptionStatus = companySubscriptionStatus;
        this.companyLogo = companyLogo;
    }
}
