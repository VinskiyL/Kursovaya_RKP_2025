package ru.kafpin.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.dtos.GenreCreateDTO;
import ru.kafpin.dtos.GenreUpdateDTO;
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

    public GenresCatalog getGenreById(Long id) {
        return genreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Жанр с ID " + id + " не найден"));
    }

    public GenresCatalog createGenre(GenreCreateDTO genreDTO) {
        GenresCatalog genre = genreDTO.toEntity();
        return genreRepository.save(genre);
    }

    public GenresCatalog updateGenre(Long id, GenreUpdateDTO genreDTO) {
        GenresCatalog existingGenre = genreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Жанр с ID " + id + " не найден"));

        genreDTO.updateEntity(existingGenre);
        return genreRepository.save(existingGenre);
    }

    public void deleteGenre(Long id) {
        GenresCatalog genre = genreRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Жанр с ID " + id + " не найден"));

        // Проверяем есть ли у жанра книги
        if (genre.getBooksGenres() != null && !genre.getBooksGenres().isEmpty()) {
            throw new IllegalStateException("Нельзя удалить жанр, у которого есть книги");
        }

        genreRepository.delete(genre);
    }
}