package ru.kafpin.repositories;

import ru.kafpin.pojos.AuthorsCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorsCatalogRepository extends JpaRepository<AuthorsCatalog, Long> {
}