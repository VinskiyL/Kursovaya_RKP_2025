package ru.kafpin.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kafpin.dtos.BookingResponseDTO;
import ru.kafpin.dtos.BookingUpdateDTO;
import ru.kafpin.pojos.BookingCatalog;
import ru.kafpin.pojos.BooksCatalog;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.repositories.BookingCatalogRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final BookingCatalogRepository bookingRepository;

    @Autowired
    public BookingService(BookingCatalogRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
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

    public void deleteBooking(Long id) {
        BookingCatalog booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Бронь с ID " + id + " не найдена"));

        if (booking.getIssued() && !booking.getReturned()) {
            throw new IllegalStateException("Нельзя удалить выдачу, пока книга не возвращена");
        }

        bookingRepository.delete(booking);
    }

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
}