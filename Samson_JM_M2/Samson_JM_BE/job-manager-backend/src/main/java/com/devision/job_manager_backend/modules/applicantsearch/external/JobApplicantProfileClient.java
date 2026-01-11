package com.devision.job_manager_backend.modules.applicantsearch.external;

import java.util.Collections;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestTemplate;

import com.devision.job_manager_backend.modules.applicantsearch.external.dto.JobApplicantProfile;
import com.devision.job_manager_backend.modules.applicantsearch.external.dto.JobApplicantProfileResponse;

@Service
@Slf4j
public class JobApplicantProfileClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String authToken;
    private final String withDetailsPath;

    @Value("${jobapplicant.header.x-api-key}")
    private String apiKey;

    public JobApplicantProfileClient(
            RestTemplateBuilder builder,
            @Value("${jobapplicant.profile.base-url}") String baseUrl,
            @Value("${jobapplicant.profile.auth-token:}") String authToken,
            @Value("${jobapplicant.profile.with-details-path}") String withDetailsPath
    ) {
        this.restTemplate = builder.build();
        this.baseUrl = baseUrl;
        this.authToken = authToken;
        this.withDetailsPath = withDetailsPath;
    }

    public List<JobApplicantProfile> fetchProfiles() {

        log.error("### fetchProfiles() EXECUTED ###");


        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);

        if (authToken != null && !authToken.isBlank()) {
            headers.setBearerAuth(authToken);
        }

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        log.error(
            "### x-api-key null? {}, length={}",
            apiKey == null,
            apiKey != null ? apiKey.length() : -1
        );


        String url = UriComponentsBuilder
                .fromUriString(baseUrl)
                .path(withDetailsPath)
                .toUriString();

        // ✅ Safe verification logs
        log.info(
            "JA call → url={}, x-api-key present={}",
            url,
            apiKey != null && !apiKey.isBlank()
        );

        try {
            ResponseEntity<JobApplicantProfileResponse> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            JobApplicantProfileResponse.class
                    );

            JobApplicantProfileResponse body = response.getBody();
            if (body == null || !body.isSuccess() || body.getData() == null) {
                return Collections.emptyList();
            }

            return body.getData();

        } catch (RestClientException ex) {
            log.error("Failed to fetch applicant profiles", ex);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Failed to fetch applicant profiles"
            );
        }
    }
}
