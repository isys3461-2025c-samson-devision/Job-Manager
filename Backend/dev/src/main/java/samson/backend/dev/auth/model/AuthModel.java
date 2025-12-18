package samson.backend.dev.auth.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class AuthModel {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;
    private Role role;
    private String referenceId;

    public AuthModel(String email, String passswordHash, Role role, String referenceId) {
        this.email = email;
        this.passwordHash = passswordHash;
        this.role = role;
        this.referenceId = referenceId;
    }

    public AuthModel() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }
}
