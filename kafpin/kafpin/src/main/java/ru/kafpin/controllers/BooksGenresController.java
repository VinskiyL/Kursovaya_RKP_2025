package ru.kafpin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ru.kafpin.pojos.AuthorsBooks;
import ru.kafpin.pojos.BooksGenres;
import ru.kafpin.services.AuthorsBooksService;
import ru.kafpin.services.BooksGenresService;

import java.util.List;

@RestController
@RequestMapping("/api/books-genres")
@CrossOrigin(origins = "http://localhost:5173")
public class BooksGenresController {

    private final BooksGenresService booksGenresService;

    @Autowired
    public BooksGenresController(BooksGenresService booksGenresService) {
        this.booksGenresService = booksGenresService;
    }


    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<BooksGenres> getAllAuthorBookRelations() {
        return booksGenresService.getAllBookGenreRelations();
    }
}