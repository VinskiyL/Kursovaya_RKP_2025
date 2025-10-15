package ru.kafpin.services;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.BookingCatalog;
import ru.kafpin.repositories.BookingCatalogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

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
}