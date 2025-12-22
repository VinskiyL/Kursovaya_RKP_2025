package ru.kafpin.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
@Slf4j
public class EmailQueueService {

    private final JavaMailSender mailSender;

    // 🔥 Простая in-memory очередь
    private final ConcurrentLinkedQueue<EmailTask> emailQueue = new ConcurrentLinkedQueue<>();

    public EmailQueueService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Элемент очереди
     */
    private static class EmailTask {
        String to;
        String subject;
        String body;
        int attempts;
        LocalDateTime createdAt;

        EmailTask(String to, String subject, String body) {
            this.to = to;
            this.subject = subject;
            this.body = body;
            this.attempts = 0;
            this.createdAt = LocalDateTime.now();
        }
    }

    /**
     * Добавить email в очередь
     */
    public void enqueueEmail(String to, String subject, String body) {
        EmailTask task = new EmailTask(to, subject, body);
        emailQueue.add(task);

        log.info("📨 Email добавлен в очередь: {} -> {}", subject, to);

        // 🔥 ДЕМО-логирование
        System.out.println("\n" + "=".repeat(60));
        System.out.println("📨 ДЕМО: Email добавлен в очередь");
        System.out.println("Кому: " + to);
        System.out.println("Тема: " + subject);
        System.out.println("Создан: " + task.createdAt);
        System.out.println("В очереди: " + emailQueue.size() + " писем");
        System.out.println("=".repeat(60) + "\n");
    }

    @Scheduled(fixedDelay = 30000) // 10 секунд
    public void processQueue() {
        if (emailQueue.isEmpty()) {
            log.debug("📭 Очередь emails пуста");
            return;
        }

        log.info("📤 Обработка очереди: {} emails", emailQueue.size());

        // 🔥 Проверяем интернет (пропингуем Gmail)
        boolean hasInternet = checkInternetConnection();

        if (!hasInternet) {
            log.warn("🌐 Нет интернета, пропускаем отправку");
            return;
        }

        // Пытаемся отправить ВСЕ письма из очереди
        int sentCount = 0;
        EmailTask task;

        while ((task = emailQueue.peek()) != null) {
            try {
                sendEmailNow(task.to, task.subject, task.body);
                emailQueue.poll(); // Удаляем успешно отправленное
                sentCount++;

                log.info("✅ Email отправлен из очереди: {}", task.subject);

            } catch (Exception e) {
                task.attempts++;
                log.warn("⚠️ Не удалось отправить email (попытка {}): {}",
                        task.attempts, e.getMessage());

                // Если больше 10 попыток - удаляем из очереди
                if (task.attempts >= 10) {
                    emailQueue.poll();
                    log.error("❌ Email удалён из очереди после 10 неудачных попыток: {}",
                            task.subject);
                }

                break; // Прерываем если ошибка
            }
        }

        if (sentCount > 0) {
            log.info("📨 Отправлено {} писем из очереди", sentCount);
        }
    }

    /**
     * Проверка интернета (упрощённо)
     */
    private boolean checkInternetConnection() {
        try {
            // Пытаемся разрешить DNS имя
            java.net.InetAddress.getByName("smtp.gmail.com");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Непосредственная отправка email
     */
    private void sendEmailNow(String to, String subject, String body) throws Exception {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("library <katuhatm@gmail.com>");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    /**
     * Для тестирования - статус очереди
     */
    public String getQueueStatus() {
        return String.format("В очереди: %d писем", emailQueue.size());
    }
}