package samson.backend.dev.company.controller;
import org.springframework.web.bind.annotation.RestController;

import samson.backend.dev.company.model.CompanyModel;
import samson.backend.dev.company.service.CompanyService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
    @Autowired
    private CompanyService companyService;

    @GetMapping("path")
    public List<CompanyModel> getAllCompany() {
        return companyService.getAllCompanies();
    }
    @PostMapping("path")
    public CompanyModel createCompany(@RequestBody CompanyModel company) {
        return companyService.createCompany(company);
    }
    
}
