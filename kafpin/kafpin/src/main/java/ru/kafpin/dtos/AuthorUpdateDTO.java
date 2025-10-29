package ru.kafpin.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.kafpin.pojos.AuthorsCatalog;

@EqualsAndHashCode(callSuper = true)
@Data
public class AuthorUpdateDTO extends AuthorCreateDTO{

    @NotNull(message = "ID автора не может быть пустым")
    private Long id;

    public void updateEntity(AuthorsCatalog author) {
        author.setAuthorSurname(this.getAuthorSurname());
        author.setAuthorName(this.getAuthorName());
        author.setAuthorPatronymic(this.getAuthorPatronymic());
    }
}
