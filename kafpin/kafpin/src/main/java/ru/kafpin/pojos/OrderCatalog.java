package ru.kafpin.pojos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "Order_catalog", schema = "kursovaya")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "author_surname", nullable = false)
    private String authorSurname;

    @Column(name = "author_name")
    private String authorName;

    @Column(name = "author_patronymic")
    private String authorPatronymic;

    @Column(name = "quantyti", nullable = false)
    private Integer quantyti;

    @Column(name = "date_publication")
    private String datePublication;

    @Column(name = "confirmed", nullable = false)
    private Boolean confirmed = false;

    @ManyToOne
    @JoinColumn(name = "reader_id", nullable = false)
    @JsonBackReference("reader-orders")
    private ReadersCatalog reader;
}