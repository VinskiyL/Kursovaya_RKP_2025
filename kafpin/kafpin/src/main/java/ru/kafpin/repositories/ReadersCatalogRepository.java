package ru.kafpin.repositories;

import ru.kafpin.pojos.ReadersCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadersCatalogRepository extends JpaRepository<ReadersCatalog, Long> {
}