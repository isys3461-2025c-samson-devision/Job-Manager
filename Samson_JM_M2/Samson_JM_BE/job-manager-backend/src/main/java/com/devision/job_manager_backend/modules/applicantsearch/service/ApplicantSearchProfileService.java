package com.devision.job_manager_backend.modules.applicantsearch.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.devision.job_manager_backend.modules.applicantsearch.dto.request.ApplicantSearchProfileRequest;
import com.devision.job_manager_backend.modules.applicantsearch.model.ApplicantSearchProfile;
import com.devision.job_manager_backend.modules.applicantsearch.repository.ApplicantSearchProfileRepository;
import com.devision.job_manager_backend.modules.subscription.model.PayerType;
import com.devision.job_manager_backend.modules.subscription.model.SubscriptionModel;
import com.devision.job_manager_backend.modules.subscription.service.internal.SubscriptionService;

@Service
@RequiredArgsConstructor
public class ApplicantSearchProfileService {

    private final ApplicantSearchProfileRepository repository;
    private final SubscriptionService subscriptionService;
    private static final List<String> EMPLOYMENT_STATUS_ALLOWED = List.of(
            "Full-time",
            "Part-time",
            "Fresher",
            "Internship",
            "Contract"
    );

    public ApplicantSearchProfile getProfile(String ownerId) {
        requirePremium(ownerId);
        return repository.findByOwnerId(ownerId).orElse(null);
    }

    public ApplicantSearchProfile saveProfile(
            String ownerId,
            ApplicantSearchProfileRequest request
    ) {
        requirePremium(ownerId);
        validateSalaryRange(request);

        ApplicantSearchProfile profile = repository.findByOwnerId(ownerId)
                .orElseGet(ApplicantSearchProfile::new);

        if (profile.getId() == null) {
            profile.setOwnerId(ownerId);
            profile.setCreatedAt(Instant.now());
        }

        profile.setTechnicalBackground(normalizeTags(request.getTechnicalBackground()));
        profile.setEmploymentStatuses(normalizeEmploymentStatuses(request.getEmploymentStatuses()));
        profile.setCountry(normalizeValue(request.getCountry()));
        profile.setSalaryMin(resolveSalaryMin(request.getSalaryMin()));
        profile.setSalaryMax(request.getSalaryMax());
        profile.setHighestEducationDegree(normalizeValue(request.getHighestEducationDegree()));
        profile.setUpdatedAt(Instant.now());

        return repository.save(profile);
    }

    private void requirePremium(String ownerId) {
        SubscriptionModel subscription = subscriptionService
                .getCurrentSubscription(ownerId)
                .orElse(null);

        if (subscription == null || !subscriptionService.isPremium(subscription)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Premium subscription required"
            );
        }

        if (subscription.getOwnerType() != null
                && subscription.getOwnerType() != PayerType.COMPANY) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Company premium subscription required"
            );
        }
    }

    private void validateSalaryRange(ApplicantSearchProfileRequest request) {
        double min = resolveSalaryMin(request.getSalaryMin());
        Double max = request.getSalaryMax();

        if (min < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Salary minimum must be zero or greater"
            );
        }

        if (max != null && max < min) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Salary maximum must be greater than or equal to minimum"
            );
        }
    }

    private double resolveSalaryMin(Double salaryMin) {
        return salaryMin == null ? 0.0 : salaryMin;
    }

    private String normalizeValue(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private List<String> normalizeTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return List.of();
        }

        Map<String, String> unique = new LinkedHashMap<>();
        for (String tag : tags) {
            if (tag == null) {
                continue;
            }
            String trimmed = tag.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            unique.putIfAbsent(trimmed.toLowerCase(), trimmed);
        }

        return new ArrayList<>(unique.values());
    }

    private List<String> normalizeEmploymentStatuses(List<String> statuses) {
        if (statuses == null || statuses.isEmpty()) {
            return List.of("Full-time", "Part-time");
        }

        Map<String, String> allowed = new LinkedHashMap<>();
        for (String status : EMPLOYMENT_STATUS_ALLOWED) {
            allowed.put(status.toLowerCase(), status);
        }

        List<String> result = new ArrayList<>();
        Set<String> seen = new java.util.HashSet<>();

        for (String status : statuses) {
            if (status == null) {
                continue;
            }
            String trimmed = status.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            String canonical = allowed.get(trimmed.toLowerCase());
            if (canonical == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid employment status: " + trimmed
                );
            }
            if (seen.add(canonical)) {
                result.add(canonical);
            }
        }

        boolean hasFull = result.contains("Full-time");
        boolean hasPart = result.contains("Part-time");
        if (!hasFull && !hasPart) {
            result.add(0, "Full-time");
            result.add(1, "Part-time");
        }

        return result;
    }
}
