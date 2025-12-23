package ru.kafpin.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegistrationRequestDTO {

    @NotBlank(message = "Фамилия обязательна")
    @Size(min = 1, max = 50, message = "Фамилия должна быть от 1 до 50 символов")
    private String surname;

    @NotBlank(message = "Имя обязательно")
    @Size(min = 1, max = 50, message = "Имя должно быть от 1 до 50 символов")
    private String name;

    @Size(max = 50, message = "Отчество должно быть до 50 символов")
    private String patronymic;

    @NotNull(message = "Дата рождения обязательна")
    @Past(message = "Дата рождения должна быть в прошлом")
    private LocalDate birthday;

    @NotBlank(message = "Образование обязательно")
    @Size(min = 1, max = 100, message = "Образование должно быть от 1 до 100 символов")
    private String education;

    private String profession;

    private String educationalInst;

    @NotBlank(message = "Город обязателен")
    @Size(min = 1, max = 50, message = "Город должен быть от 1 до 50 символов")
    private String city;

    @NotBlank(message = "Улица обязательна")
    @Size(min = 1, max = 100, message = "Улица должна быть от 1 до 100 символов")
    private String street;

    @NotNull(message = "Номер дома обязателен")
    @Min(value = 1, message = "Номер дома должен быть положительным")
    @Max(value = 1000, message = "Номер дома не может быть больше 1000")
    private Integer house;

    private String buildingHouse;

    @Min(value = 1, message = "Номер квартиры должен быть положительным")
    @Max(value = 1000, message = "Номер квартиры не может быть больше 1000")
    private Integer flat;

    @NotNull(message = "Серия паспорта обязательна")
    @Min(value = 1000, message = "Серия паспорта должна быть 4 цифры")
    @Max(value = 9999, message = "Серия паспорта должна быть 4 цифры")
    private Integer passportSeries;

    @NotNull(message = "Номер паспорта обязателен")
    @Min(value = 100000, message = "Номер паспорта должен быть 6 цифр")
    @Max(value = 999999, message = "Номер паспорта должен быть 6 цифр")
    private Integer passportNumber;

    @NotBlank(message = "Кем выдан обязательно")
    @Size(min = 1, max = 200, message = "Кем выдан должен быть от 1 до 200 символов")
    private String issuedByWhom;

    @NotNull(message = "Дата выдачи обязательна")
    @Past(message = "Дата выдачи должна быть в прошлом")
    private LocalDate dateIssue;

    @NotBlank(message = "Телефон обязателен")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Неверный формат телефона")
    private String phone;

    @NotBlank(message = "Логин обязателен")
    @Size(min = 3, max = 50, message = "Логин должен быть от 3 до 50 символов")
    private String login;

    @NotBlank(message = "Пароль обязателен")
    @Size(min = 6, message = "Пароль должен быть не менее 6 символов")
    private String password;

    @NotBlank(message = "Подтверждение пароля обязательно")
    private String confirmPassword;

    @NotBlank(message = "Почта обязательна")
    @Email(message = "Неверный формат почты")
    private String mail;
}