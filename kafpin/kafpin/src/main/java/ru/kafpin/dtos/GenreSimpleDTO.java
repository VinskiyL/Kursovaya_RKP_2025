package ru.kafpin.dtos;

import lombok.Data;

@Data
public class GenreSimpleDTO {
    private Long id;
    private String name;

    public String getFormattedName() {
        return name != null ? name.trim() : "";
    }
}