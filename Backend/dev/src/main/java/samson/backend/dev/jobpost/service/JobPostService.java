package samson.backend.dev.jobpost.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import samson.backend.dev.jobpost.API.JobPostExternalInterface;
import samson.backend.dev.jobpost.API.JobPostInternalInterface;
import samson.backend.dev.jobpost.repository.JobPostRepo;
import samson.backend.dev.jobpost.model.*;

@Service
public class JobPostService implements JobPostExternalInterface, JobPostInternalInterface {

    @Autowired
    private final JobPostRepo jobPostRepo;
    //add more logic here
    public JobPostService(JobPostRepo jobPostRepo) {
        this.jobPostRepo = jobPostRepo;
    }  
    
    public List<JobPostModel> getAllJobPosts() {
        return jobPostRepo.findAll();
    }

    public JobPostModel createJobPost(JobPostModel jobPost) {
        return jobPostRepo.save(jobPost);
    }

    public List<JobPostModel> getJobPostsBySkillTag(JobSkillTag skillTag) {
        return jobPostRepo.findBySkillTag(skillTag);
    }

    public List<JobPostModel> getJobPostsByEmploymentType(EmploymentType employmentType) {
        return jobPostRepo.findByEmploymentType(employmentType);
    }

    public List<JobPostModel> getJobPostsBySalaryRange(SalaryType salaryType ,Double minSalary, Double maxSalary) {
        if (salaryType == SalaryType.RANGE) {
            return jobPostRepo.findBySalaryAmountMinGreaterThanEqualAndSalaryAmountMaxLessThanEqual(minSalary, maxSalary);
        }
        else if (salaryType == SalaryType.ESTIMATION) {
            return jobPostRepo.findBySalaryAmountMaxLessThanEqual(maxSalary);
        }
        else if (salaryType == SalaryType.NEGOTIABLE) {
            return jobPostRepo.findBySalaryAmountMinGreaterThanEqual(minSalary);
        }
        else{
            return null;
        }
    }

    public List<JobPostModel> getJobPostBySalaryType(SalaryType salaryType) {
        return jobPostRepo.findBySalaryType(salaryType);
    }

    public List<JobPostModel> getJobPostsByLocation(String location) {
        return jobPostRepo.findByLocation(location);
    }

    public List<JobPostModel> getPublishedJobPosts(Boolean isPublished) {
        return jobPostRepo.findByIsPublished(isPublished);
    }

    public List<JobPostModel> getJobPostsByCompanyId(String companyId) {
        return jobPostRepo.findByCompanyId(companyId);
    }

    public Optional<JobPostModel> getJobPostById(String jobPostId) {
        return jobPostRepo.findById(jobPostId);
    }

    public JobPostModel getJobPostByTitle(String jobPostTitle) {
        return jobPostRepo.findByTitle(jobPostTitle);
    }
}
