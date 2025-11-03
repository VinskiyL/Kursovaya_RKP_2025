package ru.kafpin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ru.kafpin.pojos.AuthorsBooks;
import ru.kafpin.services.AuthorsBooksService;
import java.util.List;

@RestController
@RequestMapping("/api/authors-books")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthorsBooksController {

    private final AuthorsBooksService authorsBooksService;

    @Autowired
    public AuthorsBooksController(AuthorsBooksService authorsBooksService) {
        this.authorsBooksService = authorsBooksService;
    }


    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<AuthorsBooks> getAllAuthorBookRelations() {
        return authorsBooksService.getAllAuthorBookRelations();
    }
}