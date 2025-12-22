package ru.kafpin.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangeLoginDTO {

    @NotBlank(message = "Текущий пароль обязателен")
    private String password;

    @NotBlank(message = "Новый логин обязателен")
    @Size(min = 3, max = 50, message = "Логин должен быть от 3 до 50 символов")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Логин может содержать только буквы, цифры, точки, дефисы и подчёркивания")
    private String newLogin;
}