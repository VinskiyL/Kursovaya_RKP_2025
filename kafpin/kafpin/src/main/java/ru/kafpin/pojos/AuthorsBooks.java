package ru.kafpin.pojos;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @JsonManagedReference
    private AuthorsCatalog author;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    @JsonManagedReference
    private BooksCatalog book;
}