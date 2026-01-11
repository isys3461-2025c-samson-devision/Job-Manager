package com.devision.job_manager_backend.modules.applicantsearch.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.devision.job_manager_backend.modules.applicantsearch.dto.request.ApplicantSearchRequest;
import com.devision.job_manager_backend.modules.applicantsearch.dto.response.ApplicantSearchResult;
import com.devision.job_manager_backend.modules.applicantsearch.external.JobApplicantProfileClient;
import com.devision.job_manager_backend.modules.applicantsearch.external.dto.JobApplicantProfile;

@Service
@RequiredArgsConstructor
public class ApplicantSearchService {

    private final JobApplicantProfileClient profileClient;

    public List<JobApplicantProfile> search() {
        return profileClient.fetchProfiles();
    }

    public List<ApplicantSearchResult> searchApplicants(ApplicantSearchRequest request) {
        List<JobApplicantProfile> profiles = profileClient.fetchProfiles();
        if (profiles == null || profiles.isEmpty()) {
            return List.of();
        }

        Stream<JobApplicantProfile> stream = profiles.stream();

        String keyword = normalize(request.getKeyword());
        String locationValue = normalize(request.getLocationValue());
        String locationType = normalize(request.getLocationType());
        String educationDegree = normalize(request.getEducationDegree());
        String workExperience = normalize(request.getWorkExperience());
        String workExperienceKeyword = normalize(request.getWorkExperienceKeyword());
        List<String> employmentTypes = normalizeList(request.getEmploymentTypes());
        List<String> skillTags = normalizeList(request.getSkillTags());
        Double salaryMin = request.getSalaryMin();
        Double salaryMax = request.getSalaryMax();

        if (keyword != null) {
            stream = stream.filter(profile -> matchesKeyword(profile, keyword));
        }

        if (locationValue != null) {
            stream = stream.filter(profile -> matchesLocation(profile, locationType, locationValue));
        }

        if (educationDegree != null) {
            stream = stream.filter(profile -> matchesEducation(profile, educationDegree));
        }

        if (workExperience != null) {
            stream = stream.filter(profile -> matchesWorkExperience(profile, workExperience, workExperienceKeyword));
        }

        if (!employmentTypes.isEmpty()) {
            stream = stream.filter(profile -> matchesEmploymentTypes(profile, employmentTypes));
        }

        if (!skillTags.isEmpty()) {
            stream = stream.filter(profile -> matchesSkillTags(profile, skillTags));
        }

        if (salaryMin != null || salaryMax != null) {
            stream = stream.filter(profile -> matchesSalary(profile, salaryMin, salaryMax));
        }

        return stream.map(this::toResult).toList();
    }

    private boolean matchesKeyword(JobApplicantProfile profile, String keyword) {
        String fullText = Stream.of(
                        profile.getName(),
                        extractTitle(profile),
                        profile.getSummary(),
                        joinList(profile.getSkills()),
                        buildExperienceText(profile.getWorkExperiences())
                )
                .filter(Objects::nonNull)
                .map(String::toLowerCase)
                .reduce("", (a, b) -> a + " " + b);

        return fullText.contains(keyword);
    }

    private boolean matchesLocation(JobApplicantProfile profile, String locationType, String locationValue) {
        if ("country".equals(locationType)) {
            return normalize(profile.getCountry()) != null
                    && profile.getCountry().toLowerCase(Locale.ROOT).contains(locationValue);
        }

        return normalize(profile.getCity()) != null
                && profile.getCity().toLowerCase(Locale.ROOT).contains(locationValue);
    }

    private boolean matchesEducation(JobApplicantProfile profile, String targetDegree) {
        String highest = getHighestEducationDegree(profile.getEducation());
        return highest != null && highest.equalsIgnoreCase(targetDegree);
    }

    private boolean matchesWorkExperience(
            JobApplicantProfile profile,
            String filter,
            String keyword
    ) {
        List<JobApplicantProfile.WorkExperience> experiences =
                Optional.ofNullable(profile.getWorkExperiences()).orElse(List.of());
        boolean hasExperience = !experiences.isEmpty();

        if ("none".equals(filter)) {
            return !hasExperience;
        }
        if ("any".equals(filter)) {
            return hasExperience;
        }
        if ("keyword".equals(filter)) {
            if (keyword == null) {
                return false;
            }
            String experienceText = buildExperienceText(experiences);
            return experienceText.toLowerCase(Locale.ROOT).contains(keyword);
        }
        return true;
    }

    private boolean matchesEmploymentTypes(JobApplicantProfile profile, List<String> employmentTypes) {
        List<String> applicantTypes = normalizeList(profile.getEmploymentTypes());
        if (applicantTypes.isEmpty()) {
            return false;
        }
        return employmentTypes.stream().anyMatch(type -> applicantTypes.contains(type));
    }

    private boolean matchesSkillTags(JobApplicantProfile profile, List<String> skillTags) {
        List<String> applicantSkills = normalizeList(profile.getSkills());
        if (applicantSkills.isEmpty()) {
            return false;
        }
        return skillTags.stream().anyMatch(applicantSkills::contains);
    }

    private boolean matchesSalary(JobApplicantProfile profile, Double salaryMin, Double salaryMax) {
        SalaryRange applicantRange = parseSalaryRange(profile.getExpectedSalary());
        if (applicantRange == null) {
            return true;
        }

        double min = salaryMin == null ? 0.0 : salaryMin;
        double max = salaryMax == null ? Double.MAX_VALUE : salaryMax;

        return applicantRange.min <= max && applicantRange.max >= min;
    }

    private ApplicantSearchResult toResult(JobApplicantProfile profile) {
        String name = profile.getName();
        String firstName = extractFirstName(name);
        String lastName = extractLastName(name);
        String title = extractTitle(profile);

        List<ApplicantSearchResult.EducationResponse> education = Optional
                .ofNullable(profile.getEducation())
                .orElse(List.of())
                .stream()
                .map(edu -> new ApplicantSearchResult.EducationResponse(
                        edu.getGPA(),
                        edu.getDegree(),
                        edu.getFrom(),
                        edu.getInstitution(),
                        edu.getTo()
                ))
                .toList();

        List<ApplicantSearchResult.WorkExperienceResponse> workExperiences = Optional
                .ofNullable(profile.getWorkExperiences())
                .orElse(List.of())
                .stream()
                .map(exp -> new ApplicantSearchResult.WorkExperienceResponse(
                        exp.getDescription(),
                        exp.getEndDate(),
                        exp.getStartDate(),
                        exp.getTitle()
                ))
                .toList();

        String avatarUrl = buildAvatarUrl(profile);

        return new ApplicantSearchResult(
                profile.getId(),
                name,
                firstName,
                lastName,
                profile.getEmail(),
                profile.getPhone(),
                profile.getAddress(),
                profile.getCity(),
                profile.getCountry(),
                title,
                null,
                null,
                education,
                Optional.ofNullable(profile.getSkills()).orElse(List.of()),
                profile.getSummary(),
                workExperiences,
                profile.getExpectedSalary(),
                null,
                avatarUrl,
                profile.getMediaId(),
                Optional.ofNullable(profile.getEmploymentTypes()).orElse(List.of())
        );
    }

    private String buildAvatarUrl(JobApplicantProfile profile) {
        String key = profile.getId();
        if (key == null || key.isBlank()) {
            key = profile.getName() == null ? "applicant" : profile.getName();
        }
        return "https://i.pravatar.cc/80?u=" + key;
    }

    private String extractTitle(JobApplicantProfile profile) {
        return Optional.ofNullable(profile.getWorkExperiences())
                .orElse(List.of())
                .stream()
                .map(JobApplicantProfile.WorkExperience::getTitle)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    private String extractFirstName(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }
        String[] parts = name.trim().split("\\s+");
        return parts.length > 0 ? parts[0] : null;
    }

    private String extractLastName(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }
        String[] parts = name.trim().split("\\s+");
        if (parts.length <= 1) {
            return null;
        }
        return String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length));
    }

    private String getHighestEducationDegree(List<JobApplicantProfile.Education> education) {
        if (education == null || education.isEmpty()) {
            return null;
        }

        return education.stream()
                .filter(edu -> edu.getDegree() != null)
                .max(Comparator.comparingInt(this::degreeRank))
                .map(JobApplicantProfile.Education::getDegree)
                .orElse(null);
    }

    private int degreeRank(JobApplicantProfile.Education education) {
        if (education == null || education.getDegree() == null) {
            return 0;
        }
        return switch (education.getDegree()) {
            case "Bachelor" -> 1;
            case "Master" -> 2;
            case "Doctorate" -> 3;
            default -> 0;
        };
    }

    private String buildExperienceText(List<JobApplicantProfile.WorkExperience> experiences) {
        if (experiences == null || experiences.isEmpty()) {
            return "";
        }
        return experiences.stream()
                .map(exp -> (exp.getTitle() == null ? "" : exp.getTitle())
                        + " " + (exp.getDescription() == null ? "" : exp.getDescription()))
                .reduce("", (a, b) -> a + " " + b);
    }

    private String joinList(List<String> values) {
        if (values == null || values.isEmpty()) {
            return "";
        }
        return String.join(" ", values);
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        return trimmed.toLowerCase(Locale.ROOT);
    }

    private List<String> normalizeList(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        List<String> normalized = new ArrayList<>();
        for (String value : values) {
            if (value == null) {
                continue;
            }
            String trimmed = value.trim();
            if (trimmed.isEmpty()) {
                continue;
            }
            normalized.add(trimmed.toLowerCase(Locale.ROOT));
        }
        return normalized;
    }

    private SalaryRange parseSalaryRange(String value) {
        if (value == null) {
            return null;
        }

        String[] matches = value.replaceAll("[^0-9.]", " ").trim().split("\\s+");
        List<Double> numbers = new ArrayList<>();
        for (String match : matches) {
            if (match.isEmpty()) {
                continue;
            }
            try {
                numbers.add(Double.parseDouble(match));
            } catch (NumberFormatException ex) {
                // Ignore invalid numbers
            }
        }

        if (numbers.isEmpty()) {
            return null;
        }

        double min = numbers.get(0);
        double max = numbers.size() > 1 ? numbers.get(1) : numbers.get(0);
        if (max < min) {
            double temp = min;
            min = max;
            max = temp;
        }

        return new SalaryRange(min, max);
    }

    private record SalaryRange(double min, double max) {
    }
}