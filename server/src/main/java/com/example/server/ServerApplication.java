package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ServerApplication {

	public static void main(String[] args) {
		System.out.println("🔐 ENV STRIPE_WEBHOOK_SECRET = " + System.getenv("STRIPE_WEBHOOK_SECRET"));
		SpringApplication.run(ServerApplication.class, args);

	}

}
