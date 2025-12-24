package com.devision.job_manager_backend.common;

import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommonUser {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;

    public CommonUser(String id, String username, String email, String password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
