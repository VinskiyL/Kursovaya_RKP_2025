package ru.kafpin.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ru.kafpin.dtos.BookingResponseDTO;
import ru.kafpin.dtos.BookingUpdateDTO;
import ru.kafpin.services.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingResponseDTO> getAllBookings() {
        return bookingService.getAllBookingsDTO();
    }

    @PutMapping("/{id}/issue")
    public BookingResponseDTO issueBooking(@PathVariable Long id) {
        return bookingService.issueBooking(id);
    }

    @PutMapping("/{id}/issue-with-fix")
    public BookingResponseDTO issueBookingWithDateFix(@PathVariable Long id) {
        return bookingService.issueBookingWithDateFix(id);
    }

    @PutMapping("/{id}/return")
    public BookingResponseDTO returnBooking(@PathVariable Long id) {
        return bookingService.returnBooking(id);
    }

    @PutMapping("/{id}")
    public BookingResponseDTO updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingUpdateDTO updateDTO) {
        return bookingService.updateBooking(id, updateDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
    }
}