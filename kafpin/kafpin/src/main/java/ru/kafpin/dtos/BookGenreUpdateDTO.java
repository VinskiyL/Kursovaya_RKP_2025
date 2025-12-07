package ru.kafpin.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.pojos.BooksGenres;
import ru.kafpin.pojos.GenresCatalog;

@Data
public class BookGenreUpdateDTO {
    @NotNull(message = "ID связи не может быть пустым")
    private Long id;

    private Long bookId;
    private Long genreId;

    public void updateEntity(BooksGenres bg, BooksCatalog book, GenresCatalog genre) {
        if (book != null) bg.setBook(book);
        if (genre != null) bg.setGenre(genre);
    }
}
