package samson.backend.dev.company;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import samson.backend.dev.company.repository.CompanyRepo;
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
        company3.setCompanySubscriptionStatus("SUBSCRIBED");
        company3.setCompanyLogo(null);
        repo.save(company3);
    }    
}
