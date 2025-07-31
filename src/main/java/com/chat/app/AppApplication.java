package com.chat.app;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AppApplication {

	public static void main(String[] args) {
		// Load .env file and set MONGODB_URI as a system property
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		String mongoUri = dotenv.get("MONGODB_URI");
		if (mongoUri != null) {
			System.setProperty("MONGODB_URI", mongoUri);
			System.out.println("Loaded MONGODB_URI from .env: " + mongoUri);
		} else {
			System.out.println("MONGODB_URI not found in .env");
		}
		SpringApplication.run(AppApplication.class, args);
	}
}
