package samson.backend.dev.jobpost.model;

import org.springframework.data.mongodb.core.mapping.Document;
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
    private Long Id;
    private String name;
    private String email;
    private String phoneNumber;
}
