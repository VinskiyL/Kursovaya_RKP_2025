package ru.kafpin.dtos;

import lombok.Data;

@Data
public class OrderResponseDTO {
    private Long id;
    private String title;
    private String authorSurname;
    private String authorName;
    private String authorPatronymic;
    private Integer quantity;
    private String datePublication;
    private Boolean confirmed;
    private Long readerId;
}