package samson.backend.dev.jobpost.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import samson.backend.dev.jobpost.API.JobPostExternalInterface;
import samson.backend.dev.jobpost.API.JobPostInternalInterface;
import samson.backend.dev.jobpost.repository.JobPostRepo;

@Service
class JobPostService implements JobPostExternalInterface, JobPostInternalInterface {
    @Autowired
    private JobPostRepo jobPostRepo;
}
