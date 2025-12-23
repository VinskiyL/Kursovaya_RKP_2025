package ru.kafpin.repositories;

import ru.kafpin.pojos.ReadersCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReadersCatalogRepository extends JpaRepository<ReadersCatalog, Long> {
    Optional<ReadersCatalog> findByLogin(String login);
    Optional<ReadersCatalog> findByMail(String mail);
    boolean existsByPassportSeriesAndPassportNumber(Integer series, Integer number);
}