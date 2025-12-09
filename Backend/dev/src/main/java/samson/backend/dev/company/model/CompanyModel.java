package samson.backend.dev.company.model;

import org.springframework.data.mongodb.core.mapping.Document;
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
}
