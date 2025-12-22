package com.devision.job_manager_backend.modules.company.dto.response;

public class CompanyPublicProfileResponse {

    private String companyId;
    private String name;
    private String aboutUs;
    private String whoWeAreLookingFor;

    private String city;
    private String country;
    private String logoUrl;

    public CompanyPublicProfileResponse() {
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAboutUs() {
        return aboutUs;
    }

    public void setAboutUs(String aboutUs) {
        this.aboutUs = aboutUs;
    }

    public String getWhoWeAreLookingFor() {
        return whoWeAreLookingFor;
    }

    public void setWhoWeAreLookingFor(String whoWeAreLookingFor) {
        this.whoWeAreLookingFor = whoWeAreLookingFor;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
}

