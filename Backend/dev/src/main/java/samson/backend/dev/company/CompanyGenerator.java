package samson.backend.dev.company;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import samson.backend.dev.company.repository.CompanyRepo;
import samson.backend.dev.company.model.CompanyAchievements;
import samson.backend.dev.company.model.CompanyMedia;
import samson.backend.dev.company.model.CompanyModel;

@Component
public class CompanyGenerator implements CommandLineRunner {
    @Autowired
    private CompanyRepo repo;

    @Override
    public void run(String... args) throws Exception {
        repo.deleteAll();

        CompanyModel company1 = new CompanyModel();
        company1.setCompanyName("DevVision");
        company1.setCompanyAddress("1 Nguyen Van Linh, District 7");
        company1.setCompanyEmail("devvision@gmail.com");
        company1.setCompanyPhone("0912092002");
        company1.setCompanyCountry("Vietnam");
        company1.setCompanyCity("Ho Chi Minh City");
        company1.setCompanyTitle("Employer");
        company1.setCompanyAbout("DEVision is a fast-growing software company focusing on HR tech solutions for SMEs in Southeast Asia. We build scalable, cloud-native systems that connect job seekers and employers across the region.");
        company1.setCompanyMedia(List.of(
            new CompanyMedia(
                1,
                "image",
                "Office space",
                "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
            ),
            new CompanyMedia(
                2,
                "image",
                "Team culture",
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            ),
            new CompanyMedia(
                3,
                "video",
                "Company introduction",
                "https://www.youtube.com/embed/dQw4w9WgXcQ"
            )
        ));
        company1.setCompanySkillsNeeded(List.of(
            "Java",
            "Spring Boot",
            "React",
            "TypeScript",
            "Microservices",
            "Docker",
            "Kubernetes",
            "PostgreSQL"
        ));
        company1.setCompanyAchievements(List.of(
            new CompanyAchievements(
                "Top 10 HR Tech Startup Vietnam 2024",
                "Recognised for innovation in recruitment platforms."
            ),
            new CompanyAchievements(
                "50+ Enterprise Customers",
                "Serving clients across Vietnam and Southeast Asia."
            ),
            new CompanyAchievements(
                "ISO 27001 Ready",
                "Strong focus on data security and compliance."
            )
        ));
        company1.setCompanySubscriptionStatus("SUBSCRIBED");
        company1.setCompanyLogo(null);
        repo.save(company1);

        CompanyModel company2 = new CompanyModel();
        company2.setCompanyName("Green Solutions");
        company2.setCompanyAddress("67 Nguyen Huu Tho, District 7");
        company2.setCompanyEmail("greensolutions@gmail.com");
        company2.setCompanyPhone("0912092022");
        company2.setCompanyCountry("Vietnam");
        company2.setCompanyCity("Ho Chi Minh City");
        company2.setCompanyTitle("Employer");
        company2.setCompanyAbout("Green Solutions is a fast-growing software company focusing on HR tech solutions for SMEs in Southeast Asia. We build scalable, cloud-native systems that connect job seekers and employers across the region.");
        company2.setCompanyMedia(List.of(
            new CompanyMedia(
                1,
                "image",
                "Office space",
                "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
            ),
            new CompanyMedia(
                2,
                "image",
                "Team culture",
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            ),
            new CompanyMedia(
                3,
                "video",
                "Company introduction",
                "https://www.youtube.com/embed/dQw4w9WgXcQ"
            )
        ));
        company2.setCompanySkillsNeeded(List.of(
            "Java",
            "Spring Boot",
            "React",
            "TypeScript",
            "Microservices",
            "Docker",
            "Kubernetes",
            "PostgreSQL"
        ));
        company2.setCompanyAchievements(List.of(
            new CompanyAchievements(
                "Top 10 HR Tech Startup Vietnam 2024",
                "Recognised for innovation in recruitment platforms."
            ),
            new CompanyAchievements(
                "50+ Enterprise Customers",
                "Serving clients across Vietnam and Southeast Asia."
            ),
            new CompanyAchievements(
                "ISO 27001 Ready",
                "Strong focus on data security and compliance."
            )
        ));
        company2.setCompanySubscriptionStatus("NOT SUBSCRIBED");
        company2.setCompanyLogo(null);
        repo.save(company2);

        CompanyModel company3 = new CompanyModel();
        company3.setCompanyName("Samson Logistics");
        company3.setCompanyAddress("70 Le Van Luong, District 7");
        company3.setCompanyEmail("samsoncompany@gmail.com");
        company3.setCompanyPhone("0912092331");
        company3.setCompanyCountry("Vietnam");
        company3.setCompanyCity("Ho Chi Minh City");
        company3.setCompanyTitle("Employer");
        company3.setCompanyAbout("Samson Logistics is a fast-growing software company focusing on HR tech solutions for SMEs in Southeast Asia. We build scalable, cloud-native systems that connect job seekers and employers across the region.");
        company3.setCompanyMedia(List.of(
            new CompanyMedia(
                1,
                "image",
                "Office space",
                "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
            ),
            new CompanyMedia(
                2,
                "image",
                "Team culture",
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            ),
            new CompanyMedia(
                3,
                "video",
                "Company introduction",
                "https://www.youtube.com/embed/dQw4w9WgXcQ"
            )
        ));
        company3.setCompanySkillsNeeded(List.of(
            "Java",
            "Spring Boot",
            "React",
            "TypeScript",
            "Microservices",
            "Docker",
            "Kubernetes",
            "PostgreSQL"
        ));
        company3.setCompanyAchievements(List.of(
            new CompanyAchievements(
                "Top 10 HR Tech Startup Vietnam 2024",
                "Recognised for innovation in recruitment platforms."
            ),
            new CompanyAchievements(
                "50+ Enterprise Customers",
                "Serving clients across Vietnam and Southeast Asia."
            ),
            new CompanyAchievements(
                "ISO 27001 Ready",
                "Strong focus on data security and compliance."
            )
        ));
        company3.setCompanySubscriptionStatus("SUBSCRIBED");
        company3.setCompanyLogo(null);
        repo.save(company3);
    }    
}
