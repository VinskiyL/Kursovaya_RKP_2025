package ru.kafpin.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;
import ru.kafpin.pojos.BooksCatalog;

@Data
public class BookCreateDTO {

    @NotBlank(message = "Индекс не может быть пустым")
    private String index;

    @NotBlank(message = "Авторский знак не может быть пустым")
    private String authorsMark;

    @NotBlank(message = "Название книги не может быть пустым")
    private String title;

    @NotBlank(message = "Место издания не может быть пустым")
    private String placePublication;

    @NotBlank(message = "Информация об издании не может быть пустым")
    private String informationPublication;

    @NotNull(message = "Объем не может быть пустым")
    @Min(value = 1, message = "Объем должен быть не менее 1 страницы")
    private Integer volume;

    @NotNull(message = "Общее количество не может быть пустым")
    @Min(value = 0, message = "Общее количество не может быть отрицательным")
    private Integer quantityTotal;

    @NotNull(message = "Оставшееся количество не может быть пустым")
    @Min(value = 0, message = "Оставшееся количество не может быть отрицательным")
    private Integer quantityRemaining;

    private String cover;

    @NotBlank(message = "Дата публикации не может быть пустой")
    private String datePublication;

    public BooksCatalog toEntity() {
        BooksCatalog book = new BooksCatalog();
        book.setIndex(this.index);
        book.setAuthorsMark(this.authorsMark);
        book.setTitle(this.title);
        book.setPlacePublication(this.placePublication);
        book.setInformationPublication(this.informationPublication);
        book.setVolume(this.volume);
        book.setQuantityTotal(this.quantityTotal);
        book.setQuantityRemaining(this.quantityRemaining);
        book.setCover(this.cover);
        book.setDatePublication(this.datePublication);
        return book;
    }
}