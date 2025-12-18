package samson.backend.dev.auth.model;

public enum Role {
    COMPANY("COMPANY"),
    ADMIN("ADMIN");

    private final String roleName;

    Role(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }

}
