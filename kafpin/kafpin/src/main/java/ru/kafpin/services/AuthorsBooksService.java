package ru.kafpin.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.AuthorsBooks;
import ru.kafpin.pojos.AuthorsCatalog;
import ru.kafpin.repositories.AuthorsBooksRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuthorsBooksService {

    private final AuthorsBooksRepository authorsBooksRepository;

    @Autowired
    public AuthorsBooksService(AuthorsBooksRepository authorsBooksRepository) {
        this.authorsBooksRepository = authorsBooksRepository;
    }

    public List<AuthorsBooks> getAllAuthorBookRelations() {
        return authorsBooksRepository.findAll();
    }

    public List<AuthorsCatalog> getBookAuthors(Long bookId) {
        List<AuthorsCatalog> authors = authorsBooksRepository.findAuthorsByBookId(bookId);
        if (authors.isEmpty()) {
            throw new EntityNotFoundException("У книги с ID " + bookId + " нет авторов");
        }
        return authors;
    }
}