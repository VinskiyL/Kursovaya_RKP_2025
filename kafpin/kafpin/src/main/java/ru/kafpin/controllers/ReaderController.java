package ru.kafpin.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kafpin.dtos.*;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.services.ReaderService;

@RestController
@RequestMapping("/api/readers")
@RequiredArgsConstructor
public class ReaderController {

    private final ReaderService readerService;

    // Существующий
    @GetMapping("/{id}")
    public ReadersCatalog getReaderById(@PathVariable Long id) {
        return readerService.getReaderById(id);
    }

    // НОВЫЙ: Получить свой профиль
    @GetMapping("/me")
    public ReadersCatalog getMyProfile(Authentication authentication) {
        String username = authentication.getName();
        return readerService.findByLogin(username);
    }

    // НОВЫЙ: Обновить основные данные
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @Valid @RequestBody ReaderUpdateDTO updateDTO,
            Authentication authentication) {
        String username = authentication.getName();
        ReadersCatalog updated = readerService.updateProfile(username, updateDTO);
        return ResponseEntity.ok(updated);
    }

    // НОВЫЙ: Изменить логин
    @PutMapping("/me/login")
    public ResponseEntity<?> changeLogin(
            @Valid @RequestBody ChangeLoginDTO changeLoginDTO,
            Authentication authentication) {
        String username = authentication.getName();
        readerService.changeLogin(username, changeLoginDTO);
        return ResponseEntity.ok().body("Логин успешно изменён");
    }

    // НОВЫЙ: Изменить пароль
    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO,
            Authentication authentication) {
        String username = authentication.getName();
        readerService.changePassword(username, changePasswordDTO);
        return ResponseEntity.ok().body("Пароль успешно изменён");
    }
}