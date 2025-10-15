package ru.kafpin.pojos;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "Books_Genres", schema = "kursovaya")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BooksGenres {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private BooksCatalog book;

    @ManyToOne
    @JoinColumn(name = "genre_id", nullable = false)
    private GenresCatalog genre;
}