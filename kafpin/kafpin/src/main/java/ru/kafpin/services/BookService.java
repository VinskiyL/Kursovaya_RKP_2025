package ru.kafpin.services;

import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.repositories.BooksCatalogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookService {

    private final BooksCatalogRepository bookRepository;

    @Autowired
    public BookService(BooksCatalogRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<BooksCatalog> getAllBooks() {
        return bookRepository.findAll();
    }

    public BooksCatalog getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    public BooksCatalog createBook(BooksCatalog book) {
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}