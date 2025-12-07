package ru.kafpin.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ru.kafpin.pojos.AuthorsBooks;
import ru.kafpin.pojos.AuthorsCatalog;
import ru.kafpin.pojos.BooksCatalog;

@Data
public class AuthorBookCreateDTO {

    @NotNull(message = "ID автора не может быть пустым")
    private Long author;

    @NotNull(message = "ID ниги не может быть пустым")
    private Long book;

    public AuthorsBooks toEntity(AuthorsCatalog author, BooksCatalog book) {
        AuthorsBooks ab = new AuthorsBooks();
        ab.setAuthor(author);
        ab.setBook(book);
        return ab;
    }
}
