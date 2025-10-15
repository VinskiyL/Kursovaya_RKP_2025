package ru.kafpin.repositories;

import ru.kafpin.pojos.AuthorsBooks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorsBooksRepository extends JpaRepository<AuthorsBooks, Long> {
}