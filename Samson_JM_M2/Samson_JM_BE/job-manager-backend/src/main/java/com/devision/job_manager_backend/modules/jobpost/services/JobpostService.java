package com.devision.job_manager_backend.modules.jobpost.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.devision.job_manager_backend.modules.jobpost.model.JobpostModel;
import com.devision.job_manager_backend.modules.jobpost.repo.JobpostRepository;


public class JobpostService {
    @Autowired
    private final JobpostRepository jobpostRepository;

    public JobpostService(JobpostRepository jobpostRepository) {
        this.jobpostRepository = jobpostRepository;
    }

    public JobpostModel createJobpost(JobpostModel jobpostModel) {
        return jobpostRepository.save(jobpostModel);
    }

    public JobpostModel updateJobpost(String id, JobpostModel jobpostModel) {
        if (!jobpostRepository.existsById(id)) {
            throw new IllegalArgumentException("Jobpost with id " + id + " does not exist.");
        }
        jobpostModel.setId(id);// replace id
        return jobpostRepository.save(jobpostModel);
    }

    public void deleteJobpostById(String jobpostId) {
        jobpostRepository.deleteById(jobpostId);
    }

    public JobpostModel getJobpostById(String jobpostId) {
        return jobpostRepository.findByJobpostId(jobpostId);
    }

    public JobpostModel getJobpostByTitle(String jobpostTitle) {
        return jobpostRepository.findByJobpostTitle(jobpostTitle);
    }

    public Iterable<JobpostModel> getAllJobposts() {
        return jobpostRepository.findAll();
    }

    public JobpostModel getJobPostByLocationCity(String city) {
        return jobpostRepository.findByJobpostLocationCity(city).stream().findFirst().orElse(null);
    }

    public JobpostModel getJobPostByLocationCountry(String country) {
        return jobpostRepository.findByJobpostLocationCountry(country).stream().findFirst().orElse(null);
    }

    public JobpostModel getJobPostByEmploymentType(String employmentType) {
        return jobpostRepository.findByEmploymentType(employmentType).stream().findFirst().orElse(null);
    }

    public List<JobpostModel> getJobPostBySalaryType(String salaryType) {
        return jobpostRepository.findBySalaryType(salaryType);
    }

    public List<JobpostModel> getJobPostByIsPublished(Boolean isPublished) {
        return jobpostRepository.findByIsPublished(isPublished);
    }

    public List<JobpostModel> getJobpostBySkillTag(List<String> skillTag) {
        return jobpostRepository.findBySkillTag(skillTag);
    }

    public List<JobpostModel> getJobPostBySalaryAmount(Double minEstimate, Double max, String salaryType) {
        List<JobpostModel> jobposts = jobpostRepository.findBySalaryType(salaryType);
        if (salaryType == "Range"){
            for (JobpostModel jobpost : jobposts) {
                if (jobpost.getSalaryAmountMin() <= minEstimate || jobpost.getSalaryAmountMax() >= max) {
                    jobposts.remove(jobpost);
                }
            }
            return jobposts;
        }else if (salaryType == "EstimationMoreThan"){
            for (JobpostModel jobpost : jobposts) {
                if (jobpost.getSalaryAmountMin() < minEstimate)  {// min is default threshold
                    jobposts.remove(jobpost);
                }
            }
            return jobposts;
        } else if (salaryType == "EstimationLessThan"){
            for (JobpostModel jobpost : jobposts) {
                if (jobpost.getSalaryAmountMin() > minEstimate)  {
                    jobposts.remove(jobpost);
                }
            }
            return jobposts;
        } else {
            jobposts.clear();// return 0 results
            return jobposts;
        }
    }
    
    public long countJobposts() {
        return jobpostRepository.count();
    }
    
    
}
