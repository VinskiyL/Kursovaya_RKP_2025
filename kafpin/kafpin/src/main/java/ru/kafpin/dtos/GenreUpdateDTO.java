package ru.kafpin.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.kafpin.pojos.GenresCatalog;

@EqualsAndHashCode(callSuper = true)
@Data
public class GenreUpdateDTO extends GenreCreateDTO {

    @NotNull(message = "ID жанра не может быть пустым")
    private Long id;

    public void updateEntity(GenresCatalog genre) {
        genre.setName(this.getName());
    }
}