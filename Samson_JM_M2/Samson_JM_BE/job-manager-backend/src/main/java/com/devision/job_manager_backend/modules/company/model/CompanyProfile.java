package com.devision.job_manager_backend.modules.company.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "company_profiles")
public class CompanyProfile {

    @Id
    private String id; // IMPORTANT: use companyId from Auth as the Mongo _id

    private String name;
    private String phone;
    private String street;
    private String city;
    private String country;

    // Public profile content
    private String aboutUs;
    private String whoWeAreLookingFor;

    // Medium later (logo upload)
    private String logoUrl;

    private Instant createdAt;
    private Instant updatedAt;

    public CompanyProfile() {
    }

    public CompanyProfile(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}