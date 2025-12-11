package samson.backend.dev.jobpost.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import samson.backend.dev.jobpost.model.JobPostModel;
import samson.backend.dev.jobpost.service.JobPostService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



// change service to private lkater when the service connected
@RestController
@RequestMapping("/api/jobposts")
public class JobPostController {
    @Autowired
    private JobPostService jobPostService;

    @GetMapping("/")
    public List<JobPostModel> getAllJobPosts() {
        // For now, just return a placeholder string
        return jobPostService.getAllJobPosts();
    }
    
    @PostMapping("/")
    public JobPostModel createJobPostModel(@RequestBody JobPostModel entity) {
        return entity;
    }
}
