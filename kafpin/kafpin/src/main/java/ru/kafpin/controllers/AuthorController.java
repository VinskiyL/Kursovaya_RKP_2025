package ru.kafpin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.AuthorsCatalog;
import ru.kafpin.services.AuthorService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/authors")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthorController {

    private final AuthorService authorService;

    @Autowired
    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public List<AuthorsCatalog> getAllAuthors() {
        return authorService.getAllAuthors();
    }

    @GetMapping("/{id}")
    public AuthorsCatalog getAuthorById(@PathVariable Long id) {
        return authorService.getAuthorById(id);
    }
}