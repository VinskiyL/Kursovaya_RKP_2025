package ru.kafpin.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonBackReference("author-books")
    private AuthorsCatalog author;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    @JsonBackReference("book-authors")
    private BooksCatalog book;

    @Transient
    @JsonProperty("authorId")
    public Long getAuthorId() {
        return author != null ? author.getId() : null;
    }

    @Transient
    @JsonProperty("bookId")
    public Long getBookId() {
        return book != null ? book.getId() : null;
    }
}