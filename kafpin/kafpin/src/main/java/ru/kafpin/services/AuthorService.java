package ru.kafpin.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import ru.kafpin.dtos.AuthorCreateDTO;
import ru.kafpin.dtos.AuthorUpdateDTO;
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

    @Transactional
    public AuthorsCatalog createAuthor(AuthorCreateDTO authorDTO) {
        AuthorsCatalog author = authorDTO.toEntity();
        return authorRepository.save(author);
    }

    @Transactional
    public AuthorsCatalog updateAuthor(Long id, AuthorUpdateDTO authorDTO) {

        AuthorsCatalog existingAuthor = authorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Автор с ID " + id + " не найден"));

        authorDTO.updateEntity(existingAuthor);
        return authorRepository.save(existingAuthor);
    }

    @Transactional
    public void deleteAuthor(Long id) {
        AuthorsCatalog author = authorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Автор с ID " + id + " не найден"));

        if (author.getAuthorsBooks() != null && !author.getAuthorsBooks().isEmpty()) {
            throw new IllegalStateException("Нельзя удалить автора, у которого есть книги");
        }

        authorRepository.delete(author);
    }
}