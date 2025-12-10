package samson.backend.dev.jobpost;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import samson.backend.dev.jobpost.repository.JobPostRepo;
import samson.backend.dev.jobpost.model.JobPostModel;

@Component
public class DataGenerator implements CommandLineRunner {
    
    @Autowired
    private JobPostRepo repo;

    @Override
    public void run(String... args) throws Exception {
        repo.deleteAll();

        JobPostModel job1 = new JobPostModel();
        job1.setId("1");
        job1.setCompanyId("1");
        job1.setTitle("Senior Frontend Developer");
        job1.setDescription("We are looking for an experienced Frontend Developer...");
        job1.setPostedDate(LocalDate.of(2024, 11, 25));
        job1.setLocation("Ho Chi Minh City");
        job1.setEmploymentType("Full-Time");
        job1.setSalaryType("Range");;
        job1.setSalaryMin(2000);
        job1.setSalaryMax(3000);
        job1.setPublished(true);
        repo.save(job1);

        JobPostModel job2 = new JobPostModel();
        job2.setId("2");
        job2.setCompanyId("1");
        job2.setTitle("Product Designer");
        job2.setDescription("Join our design team to create amazing user experiences...");
        job2.setPostedDate(LocalDate.of(2024, 11, 28));
        job2.setLocation("Hanoi");
        job2.setEmploymentType("Full-Time");
        job2.setSalaryType("Range");
        job2.setSalaryMin(2000);
        job2.setSalaryMax(3000);
        job2.setPublished(false);
        repo.save(job2);

        JobPostModel job3 = new JobPostModel();
        job3.setId("3");
        job3.setCompanyId("1");
        job3.setTitle("Junior Backend Developer");
        job3.setDescription("Assist in backend development tasks and microservices...");
        job3.setPostedDate(LocalDate.of(2024, 11, 30));
        job3.setLocation("Da Nang");
        job3.setEmploymentType("Part-Time");
        job3.setSalaryType("Range");
        job3.setSalaryMin(800);
        job3.setSalaryMax(1200);
        job3.setPublished(false);
        repo.save(job3);
    }
}
