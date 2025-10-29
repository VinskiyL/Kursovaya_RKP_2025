package ru.kafpin.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import ru.kafpin.dtos.BookCreateDTO;
import ru.kafpin.dtos.BookUpdateDTO;
import ru.kafpin.pojos.AuthorsCatalog;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.services.AuthorsBooksService;
import ru.kafpin.services.BookService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173") // для Vite/React
public class BookController {

    private final BookService bookService;
    private final AuthorsBooksService abService;

    @Autowired
    public BookController(BookService bookService, AuthorsBooksService abService) {
        this.bookService = bookService;
        this.abService = abService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<BooksCatalog> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public BooksCatalog getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BooksCatalog createBook(@Valid @RequestBody BookCreateDTO bookDTO) {
        return bookService.createBook(bookDTO);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public BooksCatalog updateBook(@PathVariable Long id, @Valid @RequestBody BookUpdateDTO bookDTO) {
        return bookService.updateBook(id, bookDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    @GetMapping("/{bookId}/authors")
    @ResponseStatus(HttpStatus.OK)
    public List<AuthorsCatalog> getBookAuthors(@PathVariable Long bookId) {
        return abService.getBookAuthors(bookId);
    }
}