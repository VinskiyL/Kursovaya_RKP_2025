package ru.kafpin.repositories;

import ru.kafpin.pojos.OrderCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderCatalogRepository extends JpaRepository<OrderCatalog, Long> {

    @Query("SELECT o FROM OrderCatalog o WHERE o.reader.id = :readerId")
    List<OrderCatalog> findByReaderId(@Param("readerId") Long readerId);

    @Query("SELECT COUNT(o) FROM OrderCatalog o WHERE o.reader.id = :readerId AND o.confirmed = false")
    long countByReaderIdAndConfirmedFalse(@Param("readerId") Long readerId);
}