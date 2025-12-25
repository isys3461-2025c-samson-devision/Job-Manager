package com.devision.job_manager_backend.modules.jobpost.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devision.job_manager_backend.modules.jobpost.model.JobpostModel;
import com.devision.job_manager_backend.modules.jobpost.services.JobpostService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping ("/api/jobpost")
public class JobpostController {
    private final JobpostService jobpostService;
    
    public JobpostController(JobpostService jobpostService) {
        this.jobpostService = jobpostService;
    }

    @GetMapping("/")// get all
    public ResponseEntity<Iterable<JobpostModel>> getAll() {
        return ResponseEntity.ok().body(jobpostService.getAllJobposts());
    }
    
    @PostMapping("/{id}")
    public ResponseEntity<JobpostModel> createJobpost(@Valid @RequestBody JobpostModel payload) {
        JobpostModel entity = jobpostService.createJobpost(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobpostModel> update(@PathVariable String id, @Valid @RequestBody JobpostModel payload) {try {
        JobpostModel updated = jobpostService.updateJobpost(id, payload);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/search/by_skill/{tag}")
    public ResponseEntity getBySkillTag(@PathVariable String tag) {
        List<JobpostModel> job = jobpostService.getJobpostBySkillTag(tag);
        return job == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(job);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<JobpostModel>> getById(@PathVariable String id) {
        Optional<JobpostModel> job = jobpostService.getJobpostById(id);
        return job == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(job);
    }

    @GetMapping("/search/by_title/{title}")
    public ResponseEntity getByTitle(@PathVariable String title) {
        JobpostModel job = jobpostService.getJobpostByTitle(title);
        return job == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(job);
    }
    @GetMapping("/search/by_location/{location}")
    public ResponseEntity getByLocationCity(@PathVariable String location) {
        JobpostModel job = jobpostService.getJobPostByLocation(location);
        return job == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(job);
    }

    @GetMapping("/search/by_salary_type/{type}")
    public ResponseEntity getBySalaryType(@PathVariable String type) {
        List<JobpostModel> job = jobpostService.getJobPostBySalaryType(type);
        return job == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(job);
    }
    

    @DeleteMapping ("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        jobpostService.deleteJobpostById(id);
        return ResponseEntity.noContent().build();
    }

    
    
}
