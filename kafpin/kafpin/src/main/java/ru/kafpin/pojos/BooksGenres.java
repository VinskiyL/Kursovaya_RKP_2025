package ru.kafpin.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonBackReference("book-genres")
    private BooksCatalog book;

    @ManyToOne
    @JoinColumn(name = "genre_id", nullable = false)
    @JsonBackReference("genre-books")
    private GenresCatalog genre;

    @Transient
    @JsonProperty("genreId")
    public Long getAuthorId() {
        return genre != null ? genre.getId() : null;
    }

    @Transient
    @JsonProperty("bookId")
    public Long getBookId() {
        return book != null ? book.getId() : null;
    }
}