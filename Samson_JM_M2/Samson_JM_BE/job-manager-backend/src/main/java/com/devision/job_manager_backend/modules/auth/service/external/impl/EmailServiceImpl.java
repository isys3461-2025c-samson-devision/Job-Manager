package com.devision.job_manager_backend.modules.auth.service.external.impl;

import com.devision.job_manager_backend.modules.auth.service.external.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.verify-url}")
    private String verifyBaseUrl;

    @Override
    public void sendVerificationEmail(String toEmail, String token) {

        String verificationLink = verifyBaseUrl + "?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your email - DevVision Job Manager");
        message.setText(
            "Welcome to DevVision Job Manager!\n\n" +
            "Please verify your email by clicking the link below:\n\n" +
            verificationLink + "\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you did not create this account, please ignore this email."
        );

        mailSender.send(message);
    }
}

