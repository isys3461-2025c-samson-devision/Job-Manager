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

    public JobApplicantProfileClient(
            RestTemplateBuilder builder,
            @Value("${jobapplicant.profile.base-url}") String baseUrl,
            @Value("${jobapplicant.profile.auth-token:}") String authToken
    ) {
        this.restTemplate = builder.build();
        this.baseUrl = baseUrl;
        this.authToken = authToken;
    }

    public List<JobApplicantProfile> fetchProfiles() {
        HttpHeaders headers = new HttpHeaders();
        if (authToken != null && !authToken.isBlank()) {
            headers.setBearerAuth(authToken);
        }

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl).toUriString();

        try {
            ResponseEntity<JobApplicantProfileResponse> response = restTemplate.exchange(
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