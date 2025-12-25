package com.devision.job_manager_backend.modules.jobpost.repo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.devision.job_manager_backend.modules.jobpost.model.JobpostModel;
import java.time.LocalDate;


public interface JobpostRepository extends MongoRepository<JobpostModel, String> {
    JobpostModel findByTitle(String jobpostTitle);
    List<JobpostModel> findByLocation(String city);
    List<JobpostModel> findByEmploymentType(String employmentType);
    List<JobpostModel> findBySkillTag(String skillTag);
    List<JobpostModel> findBySalaryType(String salaryType);
    List<JobpostModel> findByIsPublished(Boolean isPublished);
    List<JobpostModel> findByPostedDate(LocalDate postedDate);
    List<JobpostModel> findByPendingApplicationContaining(List<String> pendingApplication); // return all jobposts with this applications
    List<JobpostModel> findByArchivedApplicationContaining(List<String> archivedApplication);  // return all jobposts with this applications
}
