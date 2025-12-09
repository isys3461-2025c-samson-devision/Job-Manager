package samson.backend.dev.jobpost.model;

import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

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
    private String Id;
    private String companyId;
    private String title;
    private String description;
    private LocalDate postedDate;
    private String location;
    private String employmentType;
    private String salaryType;
    private int salaryMin;
    private int salaryMax;
    private boolean isPublished;

}
