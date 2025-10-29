package ru.kafpin.repositories;

import ru.kafpin.pojos.BooksCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BooksCatalogRepository extends JpaRepository<BooksCatalog, Long> {

}