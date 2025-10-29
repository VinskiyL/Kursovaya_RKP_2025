package ru.kafpin.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.kafpin.pojos.AuthorsBooks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.kafpin.pojos.AuthorsCatalog;

import java.util.List;

@Repository
public interface AuthorsBooksRepository extends JpaRepository<AuthorsBooks, Long> {

    @Query("SELECT ab.author FROM AuthorsBooks ab WHERE ab.book.id = :bookId")
    List<AuthorsCatalog> findAuthorsByBookId(@Param("bookId") Long bookId);
}