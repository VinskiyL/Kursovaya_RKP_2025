package ru.kafpin.pojos;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Authors_Books", schema = "kursovaya")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthorsBooks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private AuthorsCatalog author;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private BooksCatalog book;
}