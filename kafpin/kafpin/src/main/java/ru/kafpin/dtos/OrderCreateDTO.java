package ru.kafpin.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrderCreateDTO {
    @NotBlank(message = "Название книги обязательно")
    @Size(min = 1, max = 200, message = "Название должно быть от 1 до 200 символов")
    private String title;

    @NotBlank(message = "Фамилия автора обязательна")
    @Size(min = 1, max = 100, message = "Фамилия должна быть от 1 до 100 символов")
    private String authorSurname;

    @Size(max = 100, message = "Имя должно быть до 100 символов")
    private String authorName;

    @Size(max = 100, message = "Отчество должно быть до 100 символов")
    private String authorPatronymic;

    @NotNull(message = "Количество обязательно")
    @Min(value = 1, message = "Минимум 1 книга")
    @Max(value = 5, message = "Максимум 5 книг")
    private Integer quantity;

    @Pattern(regexp = "\\d{4}|^$", message = "Год должен содержать 4 цифры или быть пустым")
    private String datePublication;
}