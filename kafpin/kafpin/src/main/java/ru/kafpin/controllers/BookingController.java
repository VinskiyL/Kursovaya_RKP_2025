package ru.kafpin.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kafpin.dtos.BookingCreateDTO;
import ru.kafpin.dtos.BookingQuantityUpdateDTO;
import ru.kafpin.dtos.BookingResponseDTO;
import ru.kafpin.dtos.BookingUpdateDTO;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.services.BookingService;
import ru.kafpin.services.ReaderService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    private final BookingService bookingService;
    private final ReaderService readerService;

    @Autowired
    public BookingController(BookingService bookingService,
                             ReaderService readerService) {
        this.bookingService = bookingService;
        this.readerService = readerService;
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


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponseDTO createBooking(
            @Valid @RequestBody BookingCreateDTO createDTO,
            Authentication authentication) {

        String username = authentication.getName();
        ReadersCatalog reader = readerService.findByLogin(username);

        return bookingService.createBooking(createDTO, reader.getId());
    }

    @GetMapping("/my")
    public List<BookingResponseDTO> getMyBookings(Authentication authentication) {
        String username = authentication.getName();
        ReadersCatalog reader = readerService.findByLogin(username);

        return bookingService.getMyBookings(reader.getId());
    }

    @PatchMapping("/{id}/quantity")
    public BookingResponseDTO updateBookingQuantity(
            @PathVariable Long id,
            @Valid @RequestBody BookingQuantityUpdateDTO updateDTO) {
        return bookingService.updateBookingQuantity(id, updateDTO.getQuantity());
    }
}