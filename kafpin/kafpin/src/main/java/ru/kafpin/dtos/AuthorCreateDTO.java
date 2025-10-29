package ru.kafpin.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import ru.kafpin.pojos.AuthorsCatalog;

@Data
public class AuthorCreateDTO {

    @NotBlank(message = "Фамилия не может быть пустой")
    private String authorSurname;

    private String authorName;

    private String authorPatronymic;

    public AuthorsCatalog toEntity() {
        AuthorsCatalog author = new AuthorsCatalog();
        author.setAuthorSurname(authorSurname);
        author.setAuthorName(authorName);
        author.setAuthorPatronymic(authorPatronymic);
        return author;
    }
}
