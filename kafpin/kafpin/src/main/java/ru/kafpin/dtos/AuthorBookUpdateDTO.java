package ru.kafpin.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.kafpin.pojos.AuthorsBooks;
import ru.kafpin.pojos.AuthorsCatalog;
import ru.kafpin.pojos.BooksCatalog;

@Data
public class AuthorBookUpdateDTO{

    @NotNull(message = "ID автора-книги не может быть пустым")
    private Long id;

    private Long authorId;
    private Long bookId;

    public void updateEntity(AuthorsBooks ab, AuthorsCatalog author, BooksCatalog book) {
        if (author != null) {
            ab.setAuthor(author);
        }
        if (book != null) {
            ab.setBook(book);
        }
    }
}
