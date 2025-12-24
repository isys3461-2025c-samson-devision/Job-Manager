package com.devision.job_manager_backend.modules.jobpost.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.devision.job_manager_backend.modules.jobpost.model.JobpostModel;

public interface JobpostRepository extends MongoRepository<JobpostModel, String> {
    JobpostModel findByJobpostTitle(String jobpostTitle);
    JobpostModel findByJobpostId(String jobpostId);
    List<JobpostModel> findByJobpostRequiredSkillsIn(List<String> skills);
    List<JobpostModel> findByJobpostLocationCity(String city);
    List<JobpostModel> findByJobpostLocationCountry(String country);
    List<JobpostModel> findByEmploymentType(String employmentType);
    List<JobpostModel> findBySkillTag(List<String> skillTag);
    List<JobpostModel> findBySalaryType(String salaryType);
    List<JobpostModel> findByIsPublished(Boolean isPublished);
    List<JobpostModel> findByPendingApplication(List<String> pendingApplication); // return all jobposts with this applications
    List<JobpostModel> findByArchivedApplication(List<String> archivedApplication);  // return all jobposts with this applications

    JobpostModel deleteByJobpostId(String jobpostId);
}
