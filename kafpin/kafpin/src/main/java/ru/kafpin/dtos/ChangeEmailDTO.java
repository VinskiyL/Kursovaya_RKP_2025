package ru.kafpin.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangeEmailDTO {

    @NotBlank(message = "Текущий пароль обязателен")
    private String password;

    @NotBlank(message = "Новая почта обязательна")
    @Email(message = "Неверный формат почты")
    private String newEmail;
}