package ru.kafpin.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import ru.kafpin.dtos.BookCreateDTO;
import ru.kafpin.dtos.BookUpdateDTO;
import ru.kafpin.dtos.BookWithDetailsDTO;
import ru.kafpin.pojos.AuthorsCatalog;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.pojos.GenresCatalog;
import ru.kafpin.services.AuthorsBooksService;
import ru.kafpin.services.BookService;
import org.springframework.web.bind.annotation.*;
import ru.kafpin.services.BooksGenresService;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173") // для Vite/React
public class BookController {

    private final BookService bookService;
    private final AuthorsBooksService abService;
    private final BooksGenresService booksGenresService;

    @Autowired
    public BookController(BookService bookService,
                          AuthorsBooksService abService,
                          BooksGenresService booksGenresService) {
        this.bookService = bookService;
        this.abService = abService;
        this.booksGenresService = booksGenresService;
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

    @PostMapping("/{bookId}/authors/{authorId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addAuthorToBook(@PathVariable Long bookId, @PathVariable Long authorId) {
        abService.addAuthorToBook(bookId, authorId);
    }

    @DeleteMapping("/{bookId}/authors/{authorId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeAuthorFromBook(@PathVariable Long bookId, @PathVariable Long authorId) {
        abService.removeAuthorFromBook(bookId, authorId);
    }

    @PostMapping("/{bookId}/genres/{genreId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addGenreToBook(@PathVariable Long bookId, @PathVariable Long genreId) {
        booksGenresService.addGenreToBook(bookId, genreId);
    }

    @DeleteMapping("/{bookId}/genres/{genreId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeGenreFromBook(@PathVariable Long bookId, @PathVariable Long genreId) {
        booksGenresService.removeGenreFromBook(bookId, genreId);
    }

    @GetMapping("/{bookId}/genres")
    @ResponseStatus(HttpStatus.OK)
    public List<GenresCatalog> getBookGenres(@PathVariable Long bookId) {
        return booksGenresService.getBookGenres(bookId);
    }

    @GetMapping("/with-details")
    @ResponseStatus(HttpStatus.OK)
    public List<BookWithDetailsDTO> getAllBooksWithDetails() {
        return bookService.getAllBooksWithDetails();
    }
}