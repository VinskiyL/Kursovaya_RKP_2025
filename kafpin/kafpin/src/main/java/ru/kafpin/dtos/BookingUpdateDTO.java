package ru.kafpin.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingUpdateDTO {
    @NotNull(message = "Количество обязательно")
    @Min(value = 1, message = "Минимум 1 книга")
    @Max(value = 5, message = "Максимум 5 книг")
    private Integer quantity;

    @NotNull(message = "Дата выдачи обязательна")
    // @FutureOrPresent НЕ СТАВИМ - может быть прошлая дата при редактировании
    private LocalDate dateIssue;

    @NotNull(message = "Дата возврата обязательна")
    private LocalDate dateReturn;

    // 🆕 Кастомный валидатор для dateReturn >= dateIssue
    @AssertTrue(message = "Дата возврата должна быть после даты выдачи")
    public boolean isDateReturnValid() {
        if (dateIssue == null || dateReturn == null) {
            return true; // валидация пройдёт, но @NotNull отловит
        }
        return !dateReturn.isBefore(dateIssue);
    }
}