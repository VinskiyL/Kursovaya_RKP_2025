package ru.kafpin.repositories;

import ru.kafpin.pojos.BooksGenres;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BooksGenresRepository extends JpaRepository<BooksGenres, Long> {
}