package ru.kafpin.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingCreateDTO {
    @NotNull(message = "ID книги обязательно")
    private Long bookId;

    @NotNull(message = "Количество обязательно")
    @Min(value = 1, message = "Минимум 1 книга")
    @Max(value = 5, message = "Максимум 5 книг")
    private Integer quantity;

    @NotNull(message = "Дата выдачи обязательна")
    private LocalDate dateIssue;

    @NotNull(message = "Дата возврата обязательна")
    private LocalDate dateReturn;
}