package ru.kafpin.services;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.GenresCatalog;
import ru.kafpin.repositories.GenresCatalogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GenreService {

    private final GenresCatalogRepository genreRepository;

    @Autowired
    public GenreService(GenresCatalogRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public List<GenresCatalog> getAllGenres() {
        return genreRepository.findAll();
    }
}