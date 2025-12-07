package samson.backend.dev.jobpost;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
class JobPostService implements JobPostExternalService, JobPostInternalService {
    @Autowired
    private JobPostRepo jobPostRepo;
}
