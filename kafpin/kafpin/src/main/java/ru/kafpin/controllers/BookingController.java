package ru.kafpin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.BookingCatalog;
import ru.kafpin.services.BookingService;
import org.springframework.web.bind.annotation.*;
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
    public List<BookingCatalog> getAllBookings() {
        return bookingService.getAllBookings();
    }
}