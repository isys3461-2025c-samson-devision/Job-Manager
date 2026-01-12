package com.devision.job_manager_backend.modules.search.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;  
import lombok.RequiredArgsConstructor;

import com.devision.job_manager_backend.modules.search.dto.response.GlobalSearchResponse;
import com.devision.job_manager_backend.modules.search.service.GlobalSearchService;

@RestController
@RequestMapping("api/search")
@RequiredArgsConstructor
public class GlobalSearchController {

    private final GlobalSearchService searchService;

    @GetMapping
    public GlobalSearchResponse search(
        @RequestParam String q
    ) {
        return searchService.search(q);
    }
}
