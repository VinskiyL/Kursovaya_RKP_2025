package ru.kafpin.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.pojos.BooksGenres;
import ru.kafpin.pojos.GenresCatalog;

@Data
public class BookGenreCreateDTO {
    @NotNull(message = "ID книги не может быть пустым")
    private Long bookId;

    @NotNull(message = "ID жанра не может быть пустым")
    private Long genreId;

    public BooksGenres toEntity(BooksCatalog book, GenresCatalog genre) {
        BooksGenres bg = new BooksGenres();
        bg.setBook(book);
        bg.setGenre(genre);
        return bg;
    }
}