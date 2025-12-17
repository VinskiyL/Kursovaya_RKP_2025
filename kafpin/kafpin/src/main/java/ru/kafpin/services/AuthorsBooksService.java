package ru.kafpin.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import ru.kafpin.pojos.AuthorsBooks;
import ru.kafpin.pojos.AuthorsCatalog;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.repositories.AuthorsBooksRepository;
import org.springframework.stereotype.Service;
import ru.kafpin.repositories.AuthorsCatalogRepository;
import ru.kafpin.repositories.BooksCatalogRepository;

import java.util.List;

@Service
public class AuthorsBooksService {

    private final AuthorsBooksRepository authorsBooksRepository;
    private final AuthorsCatalogRepository authorsCatalogRepository;
    private final BooksCatalogRepository booksCatalogRepository;

    @Autowired
    public AuthorsBooksService(AuthorsBooksRepository authorsBooksRepository,
                               AuthorsCatalogRepository authorsCatalogRepository,
                               BooksCatalogRepository booksCatalogRepository) {
        this.authorsBooksRepository = authorsBooksRepository;
        this.authorsCatalogRepository = authorsCatalogRepository;
        this.booksCatalogRepository = booksCatalogRepository;
    }

    public List<AuthorsBooks> getAllAuthorBookRelations() {
        return authorsBooksRepository.findAll();
    }

    public List<AuthorsCatalog> getBookAuthors(Long bookId) {
        List<AuthorsCatalog> authors = authorsBooksRepository.findAuthorsByBookId(bookId);
        if (authors.isEmpty()) {
            throw new EntityNotFoundException("У книги с ID " + bookId + " нет авторов");
        }
        return authors;
    }

    @Transactional
    public void addAuthorToBook(Long bookId, Long authorId) {
        BooksCatalog book = booksCatalogRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Книга с ID " + bookId + " не найдена"));

        AuthorsCatalog author = authorsCatalogRepository.findById(authorId)
                .orElseThrow(() -> new EntityNotFoundException("Автор с ID " + authorId + " не найден"));

        boolean relationExists = authorsBooksRepository.findAll().stream()
                .anyMatch(ab -> ab.getBook().getId().equals(bookId) &&
                        ab.getAuthor().getId().equals(authorId));

        if (relationExists) {
            throw new IllegalStateException("Автор уже связан с этой книгой");
        }

        AuthorsBooks authorsBooks = new AuthorsBooks();
        authorsBooks.setBook(book);
        authorsBooks.setAuthor(author);

        authorsBooksRepository.save(authorsBooks);
    }

    @Transactional
    public void removeAuthorFromBook(Long bookId, Long authorId) {
        AuthorsBooks relation = authorsBooksRepository.findAll().stream()
                .filter(ab -> ab.getBook().getId().equals(bookId) &&
                        ab.getAuthor().getId().equals(authorId))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Связь между книгой и автором не найдена"));

        authorsBooksRepository.delete(relation);
    }
}