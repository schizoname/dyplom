package ua.textlink.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TextLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                TextLinkApplication.class,
                args
        );
    }
}