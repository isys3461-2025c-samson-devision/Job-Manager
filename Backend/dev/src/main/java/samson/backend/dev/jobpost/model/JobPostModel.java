package samson.backend.dev.jobpost.model;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.sql.Date;

import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "jobposts")
@Getter
@Setter
@NoArgsConstructor
public class JobPostModel {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long Id;
    private String title;
    private String description;
    private Date postedDate;
    private String location;
    private JobSkillTag skillTag;
    private EmploymentType employmentType;
    private SalaryType salaryType;
    private Double salaryAmountMin;
    private Double salaryAmountMax;
    private Boolean isPublished;

    public JobPostModel(String title, String description, Date postedDate, String location,
                        JobSkillTag skillTag, EmploymentType employmentType, SalaryType salaryType,
                        Double salaryAmountMin, Double salaryAmountMax, Boolean isPublished) {
        this.title = title;
        this.description = description;
        this.postedDate = postedDate;
        this.location = location;
        this.skillTag = skillTag;
        this.employmentType = employmentType;
        this.salaryType = salaryType;
        this.salaryAmountMin = salaryAmountMin;
        this.salaryAmountMax = salaryAmountMax;
        this.isPublished = isPublished;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Date getPostedDate() {
        return postedDate;
    }
    public void setPostedDate(Date postedDate) {
        this.postedDate = postedDate;
    }

    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public JobSkillTag getSkillTag() {
        return skillTag;
    }
    public void setSkillTag(JobSkillTag skillTag) {
        this.skillTag = skillTag;
    }
    public EmploymentType getEmploymentType() {
        return employmentType;
    }
    public void setEmploymentType(EmploymentType employmentType) {
        this.employmentType = employmentType;
    }
    public SalaryType getSalaryType() {
        return salaryType;
    }
    public void setSalaryType(SalaryType salaryType) {
        this.salaryType = salaryType;
    }
    public Double getSalaryAmountMin() {
        return salaryAmountMin;
    }
    public void setSalaryAmountMin(Double salaryAmountMin) {
        this.salaryAmountMin = salaryAmountMin;
    }
    public Double getSalaryAmountMax() {
        return salaryAmountMax;
    }

    public void setSalaryAmountMax(Double salaryAmountMax) {
        this.salaryAmountMax = salaryAmountMax;
    }
    public Boolean getIsPublished() {
        return isPublished;
    }
    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

}
