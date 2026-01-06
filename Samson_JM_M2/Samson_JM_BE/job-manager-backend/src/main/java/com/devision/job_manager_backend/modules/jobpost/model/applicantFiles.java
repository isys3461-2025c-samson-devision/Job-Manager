package com.devision.job_manager_backend.modules.jobpost.model;

import java.util.List;

record applicantFiles(String aId, String applicantCV, List<String> applicantLetter, applicantProcessStatus processStatus) {   
    // aId: applicant Id
    // applicantCV: link to CV file
    // applicantLetter: list of links to cover letter files
    // isArchived: flag to check if the application is archived or pending
}
