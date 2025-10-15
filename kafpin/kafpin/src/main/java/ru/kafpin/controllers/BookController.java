package ru.kafpin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.services.BookService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173") // для Vite/React
public class BookController {

    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<BooksCatalog> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public BooksCatalog getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PostMapping
    public BooksCatalog createBook(@RequestBody BooksCatalog book) {
        return bookService.createBook(book);
    }

    @PutMapping("/{id}")
    public BooksCatalog updateBook(@PathVariable Long id, @RequestBody BooksCatalog book) {
        book.setId(id);
        return bookService.createBook(book);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }
}