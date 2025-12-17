package ru.kafpin.repositories;

import ru.kafpin.pojos.BookingCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingCatalogRepository extends JpaRepository<BookingCatalog, Long> {

    @Query("SELECT b FROM BookingCatalog b WHERE b.reader.id = :readerId AND b.book.id = :bookId " +
            "AND (b.issued = false OR (b.issued = true AND b.returned = false))")
    List<BookingCatalog> findActiveByReaderAndBook(@Param("readerId") Long readerId,
                                                   @Param("bookId") Long bookId);

    @Query("SELECT b FROM BookingCatalog b WHERE b.reader.id = :readerId")
    List<BookingCatalog> findByReaderId(@Param("readerId") Long readerId);

    @Query("SELECT b FROM BookingCatalog b WHERE b.issued = false AND b.dateIssue < :expiryDate")
    List<BookingCatalog> findExpiredBookings(@Param("expiryDate") LocalDate expiryDate);
}