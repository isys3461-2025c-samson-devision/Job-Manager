package com.devision.job_manager_backend.modules.company.dto.request;

import jakarta.validation.constraints.Size;

public class CompanyProfileUpdateRequest {

    @Size(max = 100, message = "name too long")
    private String name;

    @Size(max = 50, message = "phone too long")
    private String phone;

    @Size(max = 100, message = "street too long")
    private String street;

    @Size(max = 50, message = "city too long")
    private String city;

    @Size(max = 50, message = "country too long")
    private String country;

    @Size(max = 2000, message = "aboutUs too long")
    private String aboutUs;

    @Size(max = 2000, message = "whoWeAreLookingFor too long")
    private String whoWeAreLookingFor;

    public CompanyProfileUpdateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getAboutUs() { return aboutUs; }
    public void setAboutUs(String aboutUs) { this.aboutUs = aboutUs; }

    public String getWhoWeAreLookingFor() { return whoWeAreLookingFor; }
    public void setWhoWeAreLookingFor(String whoWeAreLookingFor) { this.whoWeAreLookingFor = whoWeAreLookingFor; }
}
