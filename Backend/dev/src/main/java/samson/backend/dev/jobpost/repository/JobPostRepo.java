package samson.backend.dev.jobpost.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import samson.backend.dev.jobpost.model.EmploymentType;
import samson.backend.dev.jobpost.model.JobPostModel;
import samson.backend.dev.jobpost.model.JobSkillTag;
import samson.backend.dev.jobpost.model.SalaryType;


@Repository
public interface JobPostRepo extends MongoRepository<JobPostModel, String> {
    JobPostModel findByTitle(String jobPostTitle);
    List<JobPostModel> findByCompanyId(String companyId);
    List<JobPostModel> findByLocation(String jobPostLocation);
    List<JobPostModel> findByIsPublished(Boolean isPublished);
    List<JobPostModel> findBySalaryType(SalaryType salaryType);
    List<JobPostModel> findBySalaryAmountMinGreaterThanEqual(Double salaryAmountMin);
    List<JobPostModel> findBySalaryAmountMaxLessThanEqual(Double salaryAmountMax);
    List<JobPostModel> findBySalaryAmountMinGreaterThanEqualAndSalaryAmountMaxLessThanEqual(Double salaryAmountMin, Double salaryAmountMax);
    List<JobPostModel> findByEmploymentType(EmploymentType employmentType);
    List<JobPostModel> findBySkillTag(JobSkillTag skillTag);
}
