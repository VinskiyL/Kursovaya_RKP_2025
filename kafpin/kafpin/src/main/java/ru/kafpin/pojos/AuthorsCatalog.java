package ru.kafpin.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Authors_catalog", schema = "kursovaya")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthorsCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "author_surname", nullable = false)
    private String authorSurname;

    @Column(name = "author_name")
    private String authorName;

    @Column(name = "author_patronymic")
    private String authorPatronymic;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<AuthorsBooks> authorsBooks = new ArrayList<>();
}