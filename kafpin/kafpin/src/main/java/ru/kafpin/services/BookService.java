package ru.kafpin.services;

import jakarta.persistence.EntityNotFoundException;
import ru.kafpin.dtos.BookCreateDTO;
import ru.kafpin.dtos.BookUpdateDTO;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.repositories.BooksCatalogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
        return bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Книга с ID " + id + " не найдена"));
    }

    public BooksCatalog createBook(BookCreateDTO bookDTO) {
        BooksCatalog book = bookDTO.toEntity();
        return bookRepository.save(book);
    }

    public BooksCatalog updateBook(Long id, BookUpdateDTO bookDTO) {
        if (!id.equals(bookDTO.getId())) {
            throw new IllegalArgumentException("ID в пути не совпадает с ID в теле запроса");
        }

        BooksCatalog existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Книга с ID " + id + " не найдена"));

        bookDTO.updateEntity(existingBook);

        return bookRepository.save(existingBook);
    }

    public void deleteBook(Long id) {
        BooksCatalog book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Книга с ID " + id + " не найдена"));

        // 🆕 Удаляем обложку если она есть
        if (book.getCover() != null && !book.getCover().trim().isEmpty()) {
            try {
                Path coverPath = Paths.get(book.getCover());
                Files.deleteIfExists(coverPath);
            } catch (IOException e) {
                // Логируем ошибку, но не прерываем удаление книги
                System.err.println("Ошибка при удалении обложки: " + e.getMessage());
            }
        }

        bookRepository.delete(book);
    }
}