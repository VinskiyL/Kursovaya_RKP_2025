package ru.kafpin.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.kafpin.pojos.AuthorsCatalog;

@EqualsAndHashCode(callSuper = true)
@Data
public class AuthorUpdateDTO extends AuthorCreateDTO{

    public void updateEntity(AuthorsCatalog author) {
        author.setAuthorSurname(this.getAuthorSurname());
        author.setAuthorName(this.getAuthorName());
        author.setAuthorPatronymic(this.getAuthorPatronymic());
    }
}
