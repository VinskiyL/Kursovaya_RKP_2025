package ru.kafpin.services;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.AuthorsBooks;
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
}