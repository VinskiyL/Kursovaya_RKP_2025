package ru.kafpin.dtos;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingResponseDTO {
    private Long id;
    private Integer quantity;
    private LocalDate dateIssue;
    private LocalDate dateReturn;
    private Boolean issued;
    private Boolean returned;

    // Данные книги
    private Long bookId;
    private String bookTitle;

    // Данные читателя
    private Long readerId;
    private String readerFullName;

    public String getStatus() {
        if (!issued) return "Не выдана";
        if (!returned) return "Выдана";
        return "Возвращена";
    }

    public boolean isCanDelete() {
        return !issued || returned;
    }
}