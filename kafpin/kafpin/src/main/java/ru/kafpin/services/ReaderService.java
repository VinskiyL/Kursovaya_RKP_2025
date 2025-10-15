package ru.kafpin.services;

import org.springframework.beans.factory.annotation.Autowired;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.repositories.ReadersCatalogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReaderService {

    private final ReadersCatalogRepository readerRepository;

    @Autowired
    public ReaderService(ReadersCatalogRepository readerRepository) {
        this.readerRepository = readerRepository;
    }

    public List<ReadersCatalog> getAllReaders() {
        return readerRepository.findAll();
    }

    public ReadersCatalog getReaderById(Long id) {
        return readerRepository.findById(id).orElse(null);
    }
}