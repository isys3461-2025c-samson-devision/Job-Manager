package samson.backend.dev.jobpost;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "jobposts")
@Getter
@Setter
@NoArgsConstructor
public class JobPostModel {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long Id;
}
