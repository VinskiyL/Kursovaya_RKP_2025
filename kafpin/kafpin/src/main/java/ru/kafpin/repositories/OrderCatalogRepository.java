package ru.kafpin.repositories;

import ru.kafpin.pojos.OrderCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderCatalogRepository extends JpaRepository<OrderCatalog, Long> {
}