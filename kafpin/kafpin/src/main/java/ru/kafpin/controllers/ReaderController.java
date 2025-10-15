package ru.kafpin.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.services.ReaderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/readers")
@CrossOrigin(origins = "http://localhost:5173")
public class ReaderController {

    private final ReaderService readerService;

    @Autowired
    public ReaderController(ReaderService readerService) {
        this.readerService = readerService;
    }

    @GetMapping
    public List<ReadersCatalog> getAllReaders() {
        return readerService.getAllReaders();
    }

    @GetMapping("/{id}")
    public ReadersCatalog getReaderById(@PathVariable Long id) {
        return readerService.getReaderById(id);
    }
}