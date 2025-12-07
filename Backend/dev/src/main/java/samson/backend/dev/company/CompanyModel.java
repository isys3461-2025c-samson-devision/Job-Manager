package samson.backend.dev.company;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
public class CompanyModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long id;
}
