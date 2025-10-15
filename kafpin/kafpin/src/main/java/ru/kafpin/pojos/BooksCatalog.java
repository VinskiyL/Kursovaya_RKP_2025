package ru.kafpin.pojos;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Books_catalog", schema = "kursovaya")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BooksCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "index", nullable = false, unique = true)
    private String index;

    @Column(name = "authors_mark", nullable = false)
    private String authorsMark;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "place_publication", nullable = false)
    private String placePublication;

    @Column(name = "information_publication", nullable = false)
    private String informationPublication;

    @Column(name = "volume", nullable = false)
    private Integer volume;

    @Column(name = "quantity_total", nullable = false)
    private Integer quantityTotal;

    @Column(name = "quantity_remaining", nullable = false)
    private Integer quantityRemaining;

    @Column(name = "cover", length = 100)
    private String cover;

    @Column(name = "date_publication", nullable = false)
    private String datePublication;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<AuthorsBooks> authorsBooks = new ArrayList<>();

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
    private List<BooksGenres> booksGenres = new ArrayList<>();

    @OneToMany(mappedBy = "book")
    private List<BookingCatalog> bookings = new ArrayList<>();
}