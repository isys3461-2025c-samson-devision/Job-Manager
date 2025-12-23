package com.devision.job_manager_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JobManagerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobManagerBackendApplication.class, args);
	}

}
