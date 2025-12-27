package com.devision.job_manager_backend.modules.jobpost.repository;

import com.devision.job_manager_backend.modules.jobpost.model.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepository extends MongoRepository<JobPost, String> {

    /* =========================
       COMPANY SIDE
       ========================= */

    // Get all job posts of a company (published + unpublished)
    List<JobPost> findByCompanyId(String companyId);

    // Get one job post by id AND company (ownership check)
    JobPost findByIdAndCompanyId(String id, String companyId);

    /* =========================
       APPLICANT SIDE (PUBLIC)
       ========================= */

    // Only published job posts
    List<JobPost> findByIsPublishedTrue();

    // Published job posts by location
    List<JobPost> findByIsPublishedTrueAndLocationIgnoreCase(String location);

    // Published job posts matching any technical skill (OR logic)
    List<JobPost> findByIsPublishedTrueAndTechnicalSkillsIn(List<String> skills);

    // Published job posts by employment type
    List<JobPost> findByIsPublishedTrueAndEmploymentType(EmploymentType employmentType);

    // Published job posts by categories (Internship / Contract)
    List<JobPost> findByIsPublishedTrueAndCategoriesIn(List<JobCategory> categories);
}
