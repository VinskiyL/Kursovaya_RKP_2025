package ru.kafpin.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Genres_catalog", schema = "kursovaya")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GenresCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "genre", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<BooksGenres> booksGenres = new ArrayList<>();
}