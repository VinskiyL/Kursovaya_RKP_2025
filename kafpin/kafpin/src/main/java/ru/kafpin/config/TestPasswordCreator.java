/*package ru.kafpin.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;


@Component
public class TestPasswordCreator {

    @Bean
    public CommandLineRunner createTestPassword(PasswordEncoder encoder) {
        return args -> {
            // Зашифруй свой пароль и вставь в БД
            String[] rawPassword = {"admin123", "dima123", "danil123", "milena123", "ivan123", "new123"};
            Arrays.stream(rawPassword)
                    .map(encoder::encode)
                    .forEach(System.out::println);

            // Пример вывода:
            // $2a$10$Xg6lT9t7Pzq8QK8Jf5vZ8eLmNpQrS2tUvWxYzA1B3C4D5E6F7G8H9I0J
        };
    }
}*/
