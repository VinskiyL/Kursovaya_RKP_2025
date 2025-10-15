package ru.kafpin.services;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.AuthorsCatalog;
import ru.kafpin.repositories.AuthorsCatalogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuthorService {

    private final AuthorsCatalogRepository authorRepository;

    @Autowired
    public AuthorService(AuthorsCatalogRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public List<AuthorsCatalog> getAllAuthors() {
        return authorRepository.findAll();
    }

    public AuthorsCatalog getAuthorById(Long id) {
        return authorRepository.findById(id).orElse(null);
    }
}