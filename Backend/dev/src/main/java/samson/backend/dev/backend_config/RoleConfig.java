package samson.backend.dev.backend_config;

public enum RoleConfig {
    COMPANY("COMPANY"),
    ADMIN("ADMIN");

    private final String roleName;

    RoleConfig(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }

}
