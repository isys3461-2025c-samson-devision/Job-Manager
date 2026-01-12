package com.devision.job_manager_backend.modules.auth.service.external;

public interface EmailService {

    void sendVerificationEmail(String toEmail, String token);

}
