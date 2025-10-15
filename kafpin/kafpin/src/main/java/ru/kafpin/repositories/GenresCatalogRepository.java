package ru.kafpin.repositories;

import ru.kafpin.pojos.GenresCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenresCatalogRepository extends JpaRepository<GenresCatalog, Long> {
}