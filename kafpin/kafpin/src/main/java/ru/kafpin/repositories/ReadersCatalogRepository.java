package ru.kafpin.repositories;

import ru.kafpin.pojos.ReadersCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReadersCatalogRepository extends JpaRepository<ReadersCatalog, Long> {

    // Существующий
    Optional<ReadersCatalog> findByLogin(String login);

    // НОВЫЙ: Для проверки уникальности email
    Optional<ReadersCatalog> findByMail(String mail);
}