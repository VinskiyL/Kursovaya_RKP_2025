package ru.kafpin.services;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.BooksGenres;
import ru.kafpin.repositories.BooksGenresRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BooksGenresService {
    private final BooksGenresRepository booksGenresRepository;

    @Autowired
    public BooksGenresService(BooksGenresRepository booksGenresRepository) {
        this.booksGenresRepository = booksGenresRepository;
    }

    public List<BooksGenres> getAllBookGenreRelations() {
        return booksGenresRepository.findAll();
    }
}