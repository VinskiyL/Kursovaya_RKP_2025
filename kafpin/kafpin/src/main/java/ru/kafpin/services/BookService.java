package ru.kafpin.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import ru.kafpin.dtos.*;
import ru.kafpin.pojos.AuthorsCatalog;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.pojos.GenresCatalog;
import ru.kafpin.repositories.BooksCatalogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BooksCatalogRepository bookRepository;
    private final AuthorsBooksService abService;
    private final BooksGenresService booksGenresService;

    @Autowired
    public BookService(BooksCatalogRepository bookRepository,
                       AuthorsBooksService authorsBooksService,
                       BooksGenresService booksGenresService) {
        this.bookRepository = bookRepository;
        this.abService = authorsBooksService;
        this.booksGenresService = booksGenresService;
    }

    public List<BooksCatalog> getAllBooks() {
        return bookRepository.findAll();
    }

    public BooksCatalog getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Книга с ID " + id + " не найдена"));
    }

    @Transactional
    public BooksCatalog createBook(BookCreateDTO bookDTO) {
        BooksCatalog book = bookDTO.toEntity();
        return bookRepository.save(book);
    }

    @Transactional
    public BooksCatalog updateBook(Long id, BookUpdateDTO bookDTO) {
        if (!id.equals(bookDTO.getId())) {
            throw new IllegalArgumentException("ID в пути не совпадает с ID в теле запроса");
        }

        BooksCatalog existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Книга с ID " + id + " не найдена"));

        bookDTO.updateEntity(existingBook);

        return bookRepository.save(existingBook);
    }

    @Transactional
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

    public List<BookWithDetailsDTO> getAllBooksWithDetails() {
        List<BooksCatalog> books = bookRepository.findAll();

        return books.stream()
                .map(this::convertToBookWithDetailsDTO)
                .collect(Collectors.toList());
    }

    private BookWithDetailsDTO convertToBookWithDetailsDTO(BooksCatalog book) {
        BookWithDetailsDTO dto = new BookWithDetailsDTO();

        dto.setId(book.getId());
        dto.setIndex(book.getIndex());
        dto.setAuthorsMark(book.getAuthorsMark());
        dto.setTitle(book.getTitle());
        dto.setPlacePublication(book.getPlacePublication());
        dto.setInformationPublication(book.getInformationPublication());
        dto.setVolume(book.getVolume());
        dto.setQuantityTotal(book.getQuantityTotal());
        dto.setQuantityRemaining(book.getQuantityRemaining());
        dto.setCover(book.getCover());
        dto.setDatePublication(book.getDatePublication());

        List<AuthorSimpleDTO> authors = abService.getBookAuthors(book.getId())
                .stream()
                .map(this::convertToAuthorSimpleDTO)
                .collect(Collectors.toList());
        dto.setAuthors(authors);

        List<GenreSimpleDTO> genres = booksGenresService.getBookGenres(book.getId())
                .stream()
                .map(this::convertToGenreSimpleDTO)
                .collect(Collectors.toList());
        dto.setGenres(genres);

        return dto;
    }

    private AuthorSimpleDTO convertToAuthorSimpleDTO(AuthorsCatalog author) {
        AuthorSimpleDTO dto = new AuthorSimpleDTO();
        dto.setId(author.getId());
        dto.setAuthorSurname(author.getAuthorSurname());
        dto.setAuthorName(author.getAuthorName());
        dto.setAuthorPatronymic(author.getAuthorPatronymic());
        return dto;
    }

    private GenreSimpleDTO convertToGenreSimpleDTO(GenresCatalog genre) {
        GenreSimpleDTO dto = new GenreSimpleDTO();
        dto.setId(genre.getId());
        dto.setName(genre.getName());
        return dto;
    }
}