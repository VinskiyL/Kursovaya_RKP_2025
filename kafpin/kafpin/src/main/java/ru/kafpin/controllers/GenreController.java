package ru.kafpin.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import ru.kafpin.dtos.GenreCreateDTO;
import ru.kafpin.dtos.GenreUpdateDTO;
import ru.kafpin.pojos.GenresCatalog;
import ru.kafpin.services.GenreService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreService genreService;

    @Autowired
    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<GenresCatalog> getAllGenres() {
        return genreService.getAllGenres();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public GenresCatalog getGenreById(@PathVariable Long id) {
        return genreService.getGenreById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GenresCatalog createGenre(@Valid @RequestBody GenreCreateDTO genreDTO) {
        return genreService.createGenre(genreDTO);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public GenresCatalog updateGenre(@PathVariable Long id, @Valid @RequestBody GenreUpdateDTO genreDTO) {
        return genreService.updateGenre(id, genreDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGenre(@PathVariable Long id) {
        genreService.deleteGenre(id);
    }
}