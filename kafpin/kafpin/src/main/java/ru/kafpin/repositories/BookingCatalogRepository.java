package ru.kafpin.repositories;

import ru.kafpin.pojos.BookingCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingCatalogRepository extends JpaRepository<BookingCatalog, Long> {
}