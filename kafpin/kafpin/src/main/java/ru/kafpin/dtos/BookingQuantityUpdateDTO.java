package ru.kafpin.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingQuantityUpdateDTO {
    @NotNull(message = "Количество обязательно")
    @Min(value = 1, message = "Количество должно быть не менее 1")
    @Max(value = 5, message = "Количество должно быть не более 5")
    private Integer quantity;
}
