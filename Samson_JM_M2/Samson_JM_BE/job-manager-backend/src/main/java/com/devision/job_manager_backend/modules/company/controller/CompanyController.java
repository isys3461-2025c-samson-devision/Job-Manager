package com.devision.job_manager_backend.modules.company.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @GetMapping("/ping")
    public String ping() {
        return "COMPANY ACCESS OK";
    }
}
