package ru.kafpin.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.kafpin.config.ReadersCatalogDetails;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.repositories.ReadersCatalogRepository;

@Service
@RequiredArgsConstructor
public class ReadersCatalogDetailsService implements UserDetailsService {

    private final ReadersCatalogRepository repository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        ReadersCatalog reader = repository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Пользователь с логином '" + login + "' не найден"
                ));

        if (!reader.getIsActive()) {
            throw new UsernameNotFoundException("Аккаунт деактивирован");
        }

        return new ReadersCatalogDetails(reader);
    }

    public ReadersCatalog loadReaderByUsername(String login) {
        return repository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Пользователь с логином '" + login + "' не найден"
                ));
    }
}