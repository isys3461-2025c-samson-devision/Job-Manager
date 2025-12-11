package samson.backend.dev.jobpost.service;

import java.util.List;

import org.springframework.stereotype.Service;

import samson.backend.dev.jobpost.API.JobPostExternalInterface;
import samson.backend.dev.jobpost.API.JobPostInternalInterface;
import samson.backend.dev.jobpost.repository.JobPostRepo;
import samson.backend.dev.jobpost.model.*;
@Service
class JobPostService implements JobPostExternalInterface, JobPostInternalInterface {
    private final JobPostRepo jobPostRepo;
    //add more logic here
    public JobPostService(JobPostRepo jobPostRepo) {
        this.jobPostRepo = jobPostRepo;
    }  
    
    public List<JobPostModel> getJobPostsBySkillTag(JobSkillTag skillTag) {
        return jobPostRepo.findBySkillTag(skillTag);
    }

    public List<JobPostModel> getJobPostsByEmploymentType(EmploymentType employmentType) {
        return jobPostRepo.findByEmploymentType(employmentType);
    }

    public List<JobPostModel> getJobPostsBySalaryRange(Double minSalary, Double maxSalary) {
        return jobPostRepo.findBySalaryAmountMinGreaterThanEqualAndSalaryAmountMaxLessThanEqual(minSalary, maxSalary);
    }

    public List<JobPostModel> getJobPostsByLocation(String location) {
        return jobPostRepo.findByJobPostLocation(location);
    }

    public List<JobPostModel> getPublishedJobPosts() {
        return jobPostRepo.findByIsPublished(true);
    }

    public List<JobPostModel> getJobPostsByCompanyId(String companyId) {
        return jobPostRepo.findByCompanyId(companyId);
    }

    public JobPostModel getJobPostById(String jobPostId) {
        return jobPostRepo.findByJobPostId(jobPostId);
    }

    public JobPostModel getJobPostByTitle(String jobPostTitle) {
        return jobPostRepo.findByJobPostTitle(jobPostTitle);
    }
}
