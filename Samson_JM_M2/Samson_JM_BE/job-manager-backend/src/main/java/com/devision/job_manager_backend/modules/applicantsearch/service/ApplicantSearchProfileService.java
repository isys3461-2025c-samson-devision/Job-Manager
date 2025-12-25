package com.devision.job_manager_backend.modules.applicantsearch.service;

import com.devision.job_manager_backend.modules.applicantsearch.DTO.request.ApplicantSearchProfileRequest;
import com.devision.job_manager_backend.modules.applicantsearch.DTO.response.ApplicantSearchProfileResponse;
import com.devision.job_manager_backend.modules.applicantsearch.model.ApplicantSearchProfile;
import com.devision.job_manager_backend.modules.applicantsearch.repository.ApplicantSearchProfileRepository;
import com.devision.job_manager_backend.modules.subscription.service.external.SubscriptionExternalService;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class ApplicantSearchProfileService {
    private static final String FULL_TIME = "Full-time";
    private static final String PART_TIME = "Part-time";
    private static final String FRESHER = "Fresher";
    private static final String INTERNSHIP = "Internship";
    private static final String CONTRACT = "Contract";
    private static final Map<String, String> ALLOWED_STATUSES = buildAllowedStatuses();

    private final ApplicantSearchProfileRepository profileRepository;
    private final SubscriptionExternalService subscriptionExternalService;

    public ApplicantSearchProfileResponse saveProfile(
        String companyId,
        ApplicantSearchProfileRequest request
    ) {
        ensurePremium(companyId);

        ApplicantSearchProfile profile = profileRepository.findByCompanyId(companyId)
            .orElseGet(ApplicantSearchProfile::new);

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        if (profile.getId() == null) {
            profile.setCompanyId(companyId);
            profile.setCreatedAt(now);
        }

        profile.setTechnicalBackground(request.getTechnicalBackground());
        profile.setTechnicalBackgroundTags(
            normalizeTags(
                request.getTechnicalBackgroundTags(),
                request.getTechnicalBackground()
            )
        );
        profile.setEmploymentStatuses(
            normalizeEmploymentStatuses(request.getEmploymentStatuses())
        );
        profile.setCountry(request.getCountry());
        Integer normalizedMin = normalizeSalaryMin(request.getSalaryMin());
        Integer normalizedMax = normalizeSalaryMax(request.getSalaryMax());
        validateSalaryRange(normalizedMin, normalizedMax);
        profile.setSalaryMin(normalizedMin);
        profile.setSalaryMax(normalizedMax);
        profile.setHighestEducationDegree(request.getHighestEducationDegree());
        profile.setUpdatedAt(now);

        profileRepository.save(profile);
        return toResponse(profile);
    }

    public Optional<ApplicantSearchProfileResponse> getProfile(String companyId) {
        ensurePremium(companyId);
        return profileRepository.findByCompanyId(companyId)
            .map(this::toResponse);
    }

    private void ensurePremium(String companyId) {
        if (!subscriptionExternalService.isPremiumActive(companyId)) {
            throw new RuntimeException("Premium subscription required.");
        }
    }

    private ApplicantSearchProfileResponse toResponse(ApplicantSearchProfile profile) {
        return new ApplicantSearchProfileResponse(
            profile.getId(),
            profile.getTechnicalBackground(),
            profile.getTechnicalBackgroundTags(),
            profile.getEmploymentStatuses(),
            profile.getCountry(),
            profile.getSalaryMin(),
            profile.getSalaryMax(),
            profile.getHighestEducationDegree(),
            profile.getCreatedAt(),
            profile.getUpdatedAt()
        );
    }

    private List<String> normalizeEmploymentStatuses(List<String> statuses) {
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        boolean hasFullTime = false;
        boolean hasPartTime = false;

        if (statuses != null) {
            for (String status : statuses) {
                String normalizedValue = normalizeEmploymentStatus(status);
                if (normalizedValue == null) {
                    continue;
                }
                normalized.add(normalizedValue);
                if (normalizedValue.equalsIgnoreCase(FULL_TIME)) {
                    hasFullTime = true;
                } else if (normalizedValue.equalsIgnoreCase(PART_TIME)) {
                    hasPartTime = true;
                }
            }
        }

        if (!hasFullTime && !hasPartTime) {
            normalized.add(FULL_TIME);
            normalized.add(PART_TIME);
        }

        return new ArrayList<>(normalized);
    }

    private List<String> normalizeTags(List<String> tags, String fallback) {
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        if (tags != null) {
            for (String tag : tags) {
                addTag(normalized, tag);
            }
        }
        if (normalized.isEmpty() && fallback != null) {
            for (String part : fallback.split(",")) {
                addTag(normalized, part);
            }
        }
        return new ArrayList<>(normalized);
    }

    private void addTag(LinkedHashSet<String> tags, String value) {
        String trimmed = normalizeValue(value);
        if (trimmed != null) {
            tags.add(trimmed);
        }
    }

    private String normalizeValue(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeEmploymentStatus(String value) {
        String trimmed = normalizeValue(value);
        if (trimmed == null) {
            return null;
        }
        String canonical = ALLOWED_STATUSES.get(trimmed.toLowerCase());
        if (canonical == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid employment status: " + trimmed
                    + ". Allowed: " + String.join(", ", ALLOWED_STATUSES.values())
            );
        }
        return canonical;
    }

    private static Map<String, String> buildAllowedStatuses() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put(FULL_TIME.toLowerCase(), FULL_TIME);
        map.put(PART_TIME.toLowerCase(), PART_TIME);
        map.put(FRESHER.toLowerCase(), FRESHER);
        map.put(INTERNSHIP.toLowerCase(), INTERNSHIP);
        map.put(CONTRACT.toLowerCase(), CONTRACT);
        return map;
    }

    private Integer normalizeSalaryMin(Integer min) {
        if (min == null) {
            return 0;
        }
        if (min < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Salary minimum must be 0 or greater."
            );
        }
        return min;
    }

    private Integer normalizeSalaryMax(Integer max) {
        if (max == null) {
            return null;
        }
        if (max < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Salary maximum must be 0 or greater."
            );
        }
        return max;
    }

    private void validateSalaryRange(Integer min, Integer max) {
        if (max != null && min != null && max < min) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Salary maximum must be greater than or equal to minimum."
            );
        }
    }
}
