package ru.kafpin.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import ru.kafpin.pojos.GenresCatalog;

@Data
public class GenreCreateDTO {

    @NotBlank(message = "Название жанра не может быть пустым")
    private String name;

    public GenresCatalog toEntity() {
        GenresCatalog genre = new GenresCatalog();
        genre.setName(this.name);
        return genre;
    }
}