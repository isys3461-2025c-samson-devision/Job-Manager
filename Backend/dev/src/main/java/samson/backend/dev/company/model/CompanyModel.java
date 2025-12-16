package samson.backend.dev.company.model;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

import org.springframework.data.annotation.Id;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Document(collection = "companies")
@Getter
@Setter
@NoArgsConstructor
public class CompanyModel {
    
    @Id
    private String id;
    private String companyName;
    private String companyAddress;
    private String companyEmail;
    private String companyPhone;
    private String companyCountry;
    private String companyCity;
    private String companyAbout;
    private String companyTitle;
    private List<CompanyMedia> companyMedia;
    private List<String> companySkillsNeeded;
    private List<CompanyAchievements> companyAchievements;
    private String companySubscriptionStatus;
    private String companyLogo;

    public CompanyModel(String companyName, String companyAddress, String companyEmail, String companyPhone, String companyCountry, String companyCity, String companyAbout, String companyTitle, List<CompanyMedia> companyMedia, List<String> companySkillsNeeded, List<CompanyAchievements> companyAchievements, String companySubscriptionStatus, String companyLogo) {
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.companyEmail = companyEmail;
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
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getCompanyLogo() {
        return companyLogo;
    }
    public void setCompanyLogo(String companyLogo) {
        this.companyLogo = companyLogo;
    }

    public String getCompanyName() {
        return companyName;
    }
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }
    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getCompanyEmail() {
        return companyEmail;
    }
    public void setCompanyEmail(String companyEmail) {
        this.companyEmail = companyEmail;
    }
    public String getCompanyPhone() {
        return companyPhone;
    }

    public void setCompanyPhone(String companyPhone) {
        this.companyPhone = companyPhone;
    }
    public String getCompanyCountry() {
        return companyCountry;
    }

    public void setCompanyCountry(String companyCountry) {
        this.companyCountry = companyCountry;
    }
    public String getCompanyCity() {
        return companyCity;
    }
    public void setCompanyCity(String companyCity) {
        this.companyCity = companyCity;
    }

    public String getCompanyAbout() {
        return companyAbout;
    }

    public void setCompanyAbout(String companyAbout) {
        this.companyAbout = companyAbout;
    }

    public String getCompanyTitle() {
        return companyTitle;
    }

    public void setCompanyTitle(String companyTitle) {
        this.companyTitle = companyTitle;
    }

    public List<CompanyMedia> getCompanyMedia() {
        return companyMedia;
    }

    public void setCompanyMedia(List<CompanyMedia> companyMedia) {
        this.companyMedia = companyMedia;
    }

    public List<String> getCompanySkillsNeeded() {
        return companySkillsNeeded;
    }

    public void setCompanySkillsNeeded(List<String> companySkillsNeeded) {
        this.companySkillsNeeded = companySkillsNeeded;
    }

    public List<CompanyAchievements> getCompanyAchievements() {
        return companyAchievements;
    }

    public void setCompanyAchievements(List<CompanyAchievements> companyAchievements) {
        this.companyAchievements = companyAchievements;
    }

    public String getCompanySubscriptionStatus() {
        return companySubscriptionStatus;
    }
    public void setCompanySubscriptionStatus(String companySubscriptionStatus) {
        this.companySubscriptionStatus = companySubscriptionStatus;
    }
}
