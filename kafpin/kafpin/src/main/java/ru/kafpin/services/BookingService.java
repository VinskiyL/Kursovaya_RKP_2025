package ru.kafpin.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kafpin.dtos.BookingCreateDTO;
import ru.kafpin.dtos.BookingResponseDTO;
import ru.kafpin.dtos.BookingUpdateDTO;
import ru.kafpin.pojos.BookingCatalog;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.repositories.BookingCatalogRepository;
import ru.kafpin.repositories.BooksCatalogRepository;
import ru.kafpin.repositories.ReadersCatalogRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final BookingCatalogRepository bookingRepository;
    private final BooksCatalogRepository booksCatalogRepository;
    private final ReadersCatalogRepository readersCatalogRepository;

    @Autowired
    public BookingService(BookingCatalogRepository bookingRepository,
                          BooksCatalogRepository booksCatalogRepository,
                          ReadersCatalogRepository readersCatalogRepository) {
        this.bookingRepository = bookingRepository;
        this.booksCatalogRepository = booksCatalogRepository;
        this.readersCatalogRepository = readersCatalogRepository;
    }
    public List<BookingCatalog> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<BookingResponseDTO> getAllBookingsDTO() {
        List<BookingCatalog> bookings = bookingRepository.findAll();
        return bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BookingResponseDTO convertToDTO(BookingCatalog booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setQuantity(booking.getQuantity());
        dto.setDateIssue(booking.getDateIssue());
        dto.setDateReturn(booking.getDateReturn());
        dto.setIssued(booking.getIssued());
        dto.setReturned(booking.getReturned());

        BooksCatalog book = booking.getBook();
        if (book != null) {
            dto.setBookId(book.getId());
            dto.setBookTitle(book.getTitle());
        }

        ReadersCatalog reader = booking.getReader();
        if (reader != null) {
            dto.setReaderId(reader.getId());
            // Формируем ФИО
            StringBuilder fullName = new StringBuilder(reader.getSurname())
                    .append(" ").append(reader.getName());

            if (reader.getPatronymic() != null && !reader.getPatronymic().isEmpty()) {
                fullName.append(" ").append(reader.getPatronymic());
            }
            dto.setReaderFullName(fullName.toString());
        }

        return dto;
    }

    @Transactional
    public BookingResponseDTO issueBooking(Long id) {
        BookingCatalog booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Бронь с ID " + id + " не найдена"));

        if (booking.getIssued()) {
            throw new IllegalStateException("Книга уже выдана");
        }

        booking.setIssued(true);
        BookingCatalog saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }

    @Transactional
    public BookingResponseDTO returnBooking(Long id) {
        BookingCatalog booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Бронь с ID " + id + " не найдена"));

        if (!booking.getIssued()) {
            throw new IllegalStateException("Книга не была выдана");
        }
        if (booking.getReturned()) {
            throw new IllegalStateException("Книга уже возвращена");
        }

        booking.setReturned(true);
        BookingCatalog saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteBooking(Long id) {
        BookingCatalog booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Бронь с ID " + id + " не найдена"));

        if (booking.getIssued() && !booking.getReturned()) {
            throw new IllegalStateException("Нельзя удалить выдачу, пока книга не возвращена");
        }

        bookingRepository.delete(booking);
    }

    @Transactional
    public BookingResponseDTO updateBooking(Long id, @Valid BookingUpdateDTO updateDTO) {
        BookingCatalog booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Бронь с ID " + id + " не найдена"));

        if (booking.getIssued()) {
            throw new IllegalStateException("Нельзя редактировать выданную книгу");
        }

        booking.setQuantity(updateDTO.getQuantity());
        booking.setDateIssue(updateDTO.getDateIssue());
        booking.setDateReturn(updateDTO.getDateReturn());

        if (updateDTO.getDateReturn().isBefore(updateDTO.getDateIssue())) {
            throw new IllegalArgumentException("Дата возврата не может быть раньше даты выдачи");
        }

        BookingCatalog saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }

    @Transactional
    public BookingResponseDTO issueBookingWithDateFix(Long id) {
        BookingCatalog booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Бронь с ID " + id + " не найдена"));

        if (booking.getIssued()) {
            throw new IllegalStateException("Книга уже выдана");
        }

        LocalDate today = LocalDate.now();
        if (booking.getDateIssue().isBefore(today)) {
            booking.setDateIssue(today);
            System.out.println("Исправлена дата выдачи для брони ID=" + id +
                    " с " + booking.getDateIssue() + " на " + today);
        }

        booking.setIssued(true);
        BookingCatalog saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }

    @Transactional
    public BookingResponseDTO createBooking(@Valid BookingCreateDTO createDTO, Long readerId) {
        // 1. Проверка дат
        LocalDate today = LocalDate.now();
        LocalDate maxIssueDate = today.plusDays(5);

        if (createDTO.getDateIssue().isAfter(maxIssueDate)) {
            throw new IllegalArgumentException("Дата выдачи не может быть позже " + maxIssueDate);
        }

        if (createDTO.getDateReturn().isAfter(createDTO.getDateIssue().plusMonths(1))) {
            throw new IllegalArgumentException("Дата возврата не может быть позже чем через месяц от даты выдачи");
        }

        if (createDTO.getDateReturn().isBefore(createDTO.getDateIssue())) {
            throw new IllegalArgumentException("Дата возврата не может быть раньше даты выдачи");
        }

        // 2. Проверка уникальности
        List<BookingCatalog> activeBookings = bookingRepository.findActiveByReaderAndBook(readerId, createDTO.getBookId());
        if (!activeBookings.isEmpty()) {
            throw new IllegalStateException("У вас уже есть активная бронь на эту книгу");
        }

        // 3. Получаем книгу и пользователя
        BooksCatalog book = booksCatalogRepository.findById(createDTO.getBookId())
                .orElseThrow(() -> new EntityNotFoundException("Книга с ID " + createDTO.getBookId() + " не найдена"));

        ReadersCatalog reader = readersCatalogRepository.findById(readerId)
                .orElseThrow(() -> new EntityNotFoundException("Пользователь с ID " + readerId + " не найден"));

        // 4. Создаем бронь
        BookingCatalog booking = new BookingCatalog();
        booking.setBook(book);
        booking.setReader(reader);
        booking.setQuantity(createDTO.getQuantity());
        booking.setDateIssue(createDTO.getDateIssue());
        booking.setDateReturn(createDTO.getDateReturn());
        booking.setIssued(false);
        booking.setReturned(false);

        // 5. Сохраняем (триггер БД проверит quantity_remaining)
        BookingCatalog saved = bookingRepository.save(booking);

        return convertToDTO(saved);
    }

    @Transactional
    public List<BookingResponseDTO> getMyBookings(Long readerId) {
        // Очищаем просроченные брони перед возвратом
        cleanupExpiredBookings(readerId);

        // Возвращаем актуальные брони пользователя
        List<BookingCatalog> bookings = bookingRepository.findByReaderId(readerId);
        return bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void cleanupExpiredBookings(Long readerId) {
        LocalDate expiryDate = LocalDate.now().minusDays(3);
        List<BookingCatalog> expiredBookings = bookingRepository.findExpiredBookings(expiryDate)
                .stream()
                .filter(booking -> booking.getReader().getId().equals(readerId))
                .collect(Collectors.toList());

        if (!expiredBookings.isEmpty()) {
            bookingRepository.deleteAll(expiredBookings);
        }
    }

    @Transactional
    public BookingResponseDTO updateBookingQuantity(Long id, Integer quantity) {
        BookingCatalog booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Бронь с ID " + id + " не найдена"));

        if (booking.getIssued()) {
            throw new IllegalStateException("Нельзя редактировать выданную книгу");
        }

        // Проверка количества (1-5)
        if (quantity < 1 || quantity > 5) {
            throw new IllegalArgumentException("Количество должно быть от 1 до 5");
        }

        booking.setQuantity(quantity);
        BookingCatalog saved = bookingRepository.save(booking);
        return convertToDTO(saved);
    }
}