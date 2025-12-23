package com.devision.job_manager_backend.modules.subscription.service;

import com.devision.job_manager_backend.modules.auth.service.external.AuthExternalService;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionEmailService {
    private static final DateTimeFormatter DATE_FORMAT =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final JavaMailSender mailSender;
    private final AuthExternalService authExternalService;

    public void sendExpiryWarning(SubscriptionModel subscription) {
        if (subscription.getEndDate() == null) {
            return;
        }

        String to = authExternalService.getCompanyEmail(subscription.getCompanyId());
        if (to == null || to.isBlank()) {
            return;
        }

        String subject = "Premium subscription expiring soon";
        String body = "Your Premium subscription will expire on "
            + subscription.getEndDate().format(DATE_FORMAT)
            + ". Please renew to keep Premium access.";

        sendEmail(to, subject, body);
    }

    public void sendExpiredNotice(SubscriptionModel subscription) {
        if (subscription.getEndDate() == null) {
            return;
        }

        String to = authExternalService.getCompanyEmail(subscription.getCompanyId());
        if (to == null || to.isBlank()) {
            return;
        }

        String subject = "Premium subscription expired";
        String body = "Your Premium subscription expired on "
            + subscription.getEndDate().format(DATE_FORMAT)
            + ". You can upgrade again at any time.";

        sendEmail(to, subject, body);
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
