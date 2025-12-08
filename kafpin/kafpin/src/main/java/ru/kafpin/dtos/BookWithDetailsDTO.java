package ru.kafpin.dtos;

import lombok.Data;
import java.util.List;

@Data
public class BookWithDetailsDTO {
    private Long id;
    private String index;
    private String authorsMark;
    private String title;
    private String placePublication;
    private String informationPublication;
    private Integer volume;
    private Integer quantityTotal;
    private Integer quantityRemaining;
    private String cover;
    private String datePublication;

    // Список авторов этой книги
    private List<AuthorSimpleDTO> authors;

    // Список жанров этой книги
    private List<GenreSimpleDTO> genres;
}