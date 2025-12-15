package samson.backend.dev.company.model;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

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
    private String companySubscriptionStatus;
    private String companyLogo;

    public CompanyModel(String companyName, String companyAddress, String companyEmail, String companyPhone, String companyCountry, String companyCity, String companySubscriptionStatus, String companyLogo) {
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.companyEmail = companyEmail;
        this.companyPhone = companyPhone;
        this.companyCountry = companyCountry;
        this.companyCity = companyCity;
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

    public String getCompanySubscriptionStatus() {
        return companySubscriptionStatus;
    }
    public void setCompanySubscriptionStatus(String companySubscriptionStatus) {
        this.companySubscriptionStatus = companySubscriptionStatus;
    }
}
