package ru.kafpin.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final EmailQueueService emailQueueService;
    private static final String MY_EMAIL = "katuhatm@gmail.com";

    /**
     * Смена пароля - в очередь!
     */
    public void sendPasswordChangedEmail(String fullName) {
        String subject = "Пользователь сменил пароль (очередь)";
        String body = String.format("""
            Пользователь: %s
            Действие: сменил пароль
            Время добавления в очередь: %s
            Статус: ожидает отправки
            
            Это демо отложенной отправки.
            """, fullName, java.time.LocalDateTime.now());

        emailQueueService.enqueueEmail(MY_EMAIL, subject, body);
    }

    /**
     * Смена логина - в очередь!
     */
    public void sendLoginChangedEmail(String fullName, String newLogin) {
        String subject = "Пользователь сменил логин (очередь)";
        String body = String.format("""
            Пользователь: %s
            Новый логин: %s
            Действие: сменил логин
            Время добавления в очередь: %s
            
            Это демо отложенной отправки.
            """, fullName, newLogin, java.time.LocalDateTime.now());

        emailQueueService.enqueueEmail(MY_EMAIL, subject, body);
    }
}