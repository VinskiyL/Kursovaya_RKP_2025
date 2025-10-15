package ru.kafpin.pojos;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Booking_catalog", schema = "kursovaya")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "date_issue", nullable = false)
    private LocalDate dateIssue;

    @Column(name = "date_return", nullable = false)
    private LocalDate dateReturn;

    @Column(name = "issued", nullable = false)
    private Boolean issued;

    @Column(name = "returned", nullable = false)
    private Boolean returned;

    @ManyToOne
    @JoinColumn(name = "index_id", nullable = false)
    private BooksCatalog book;

    @ManyToOne
    @JoinColumn(name = "reader_id", nullable = false)
    private ReadersCatalog reader;
}