package com.devision.job_manager_backend.modules.auth.service.external;

import com.devision.job_manager_backend.modules.auth.model.CompanyAuth;

public interface AuthExternalService {

    String getEmailByUserId(String userId);

    CompanyAuth getAuthByUserId(String userId);
}
