package ru.kafpin.dtos;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AuthorSimpleDTO {
    private Long id;
    private String authorSurname;
    private String authorName;
    private String authorPatronymic;

    public String getFullName() {
        StringBuilder sb = new StringBuilder();
        if (authorSurname != null) {
            sb.append(authorSurname);
        }
        if (authorName != null && !authorName.isEmpty()) {
            sb.append(" ").append(authorName.charAt(0)).append(".");
        }
        if (authorPatronymic != null && !authorPatronymic.isEmpty()) {
            sb.append(authorPatronymic.charAt(0)).append(".");
        }
        return sb.toString();
    }

    public String getFullNameExtended() {
        List<String> parts = new ArrayList<>();
        if (authorSurname != null && !authorSurname.isEmpty()) parts.add(authorSurname);
        if (authorName != null && !authorName.isEmpty()) parts.add(authorName);
        if (authorPatronymic != null && !authorPatronymic.isEmpty()) parts.add(authorPatronymic);
        return String.join(" ", parts);
    }
}