package com.devision.job_manager_backend.modules.jobpost.model;

public enum SalaryType {
    RANGE,        // min + max
    FROM,         // min only
    UP_TO,        // max only
    ESTIMATION,   // approx
    NEGOTIABLE
}
