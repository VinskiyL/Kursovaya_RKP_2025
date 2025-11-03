package ru.kafpin.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.pojos.BooksGenres;
import ru.kafpin.pojos.GenresCatalog;
import ru.kafpin.repositories.BooksCatalogRepository;
import ru.kafpin.repositories.BooksGenresRepository;
import org.springframework.stereotype.Service;
import ru.kafpin.repositories.GenresCatalogRepository;

import java.util.List;

@Service
public class BooksGenresService {
    private final BooksGenresRepository booksGenresRepository;
    private final BooksCatalogRepository booksCatalogRepository;
    private final GenresCatalogRepository genresCatalogRepository;

    @Autowired
    public BooksGenresService(BooksGenresRepository booksGenresRepository,
                              BooksCatalogRepository booksCatalogRepository,
                              GenresCatalogRepository genresCatalogRepository) {
        this.booksGenresRepository = booksGenresRepository;
        this.booksCatalogRepository = booksCatalogRepository;
        this.genresCatalogRepository = genresCatalogRepository;
    }

    public List<BooksGenres> getAllBookGenreRelations() {
        return booksGenresRepository.findAll();
    }

    public void addGenreToBook(Long bookId, Long genreId) {
        // Проверяем существование книги и жанра
        BooksCatalog book = booksCatalogRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Книга с ID " + bookId + " не найдена"));

        GenresCatalog genre = genresCatalogRepository.findById(genreId)
                .orElseThrow(() -> new EntityNotFoundException("Жанр с ID " + genreId + " не найден"));

        // Проверяем нет ли уже такой связи
        boolean relationExists = booksGenresRepository.findAll().stream()
                .anyMatch(bg -> bg.getBook().getId().equals(bookId) &&
                        bg.getGenre().getId().equals(genreId));

        if (relationExists) {
            throw new IllegalStateException("Жанр уже связан с этой книгой");
        }

        // Создаем новую связь
        BooksGenres booksGenres = new BooksGenres();
        booksGenres.setBook(book);
        booksGenres.setGenre(genre);

        booksGenresRepository.save(booksGenres);
    }

    public void removeGenreFromBook(Long bookId, Long genreId) {
        // Находим связь для удаления
        BooksGenres relation = booksGenresRepository.findAll().stream()
                .filter(bg -> bg.getBook().getId().equals(bookId) &&
                        bg.getGenre().getId().equals(genreId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Связь между книгой и жанром не найдена"));

        booksGenresRepository.delete(relation);
    }

    // 🆕 Получить жанры книги
    public List<GenresCatalog> getBookGenres(Long bookId) {
        // Пока простой способ - потом можно оптимизировать через @Query
        return booksGenresRepository.findAll().stream()
                .filter(bg -> bg.getBook().getId().equals(bookId))
                .map(BooksGenres::getGenre)
                .toList();
    }
}