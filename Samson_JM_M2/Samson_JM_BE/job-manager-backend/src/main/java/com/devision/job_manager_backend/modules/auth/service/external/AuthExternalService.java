package com.devision.job_manager_backend.modules.auth.service.external;

import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;
import java.util.Optional;

public interface AuthExternalService {

    String getEmailByUserId(String userId);

    Optional<CompanyAuth> getAuthByUserId(String userId);
}
