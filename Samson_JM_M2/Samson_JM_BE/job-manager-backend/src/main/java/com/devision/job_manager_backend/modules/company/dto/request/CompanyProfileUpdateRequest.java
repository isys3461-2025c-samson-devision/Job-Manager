package com.devision.job_manager_backend.modules.company.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CompanyProfileUpdateRequest {

    // core info (Simplex 3.1.1)
    private String name;
    private String phone;
    private String street;
    private String city;

    @NotBlank(message = "country is required")
    private String country;

    // public profile (Simplex 3.1.2)
    private String aboutUs;
    private String whoWeAreLookingFor;

    public CompanyProfileUpdateRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
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
}

