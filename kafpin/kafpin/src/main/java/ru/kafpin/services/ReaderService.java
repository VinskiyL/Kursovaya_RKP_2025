package ru.kafpin.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kafpin.dtos.*;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.repositories.ReadersCatalogRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReaderService {

    private final ReadersCatalogRepository readerRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReadersCatalogDetailsService readersCatalogDetailsService;
    private final EmailService emailService; // 🔥 НОВОЕ: Внедряем EmailService

    // ==================== СУЩЕСТВУЮЩИЕ МЕТОДЫ ====================

    public List<ReadersCatalog> getAllReaders() {
        return readerRepository.findAll();
    }

    public ReadersCatalog getReaderById(Long id) {
        return readerRepository.findById(id).orElse(null);
    }

    public ReadersCatalog findByLogin(String login) {
        return readersCatalogDetailsService.loadReaderByUsername(login);
    }

    @Transactional
    public ReadersCatalog updateProfile(String username, ReaderUpdateDTO updateDTO) {
        ReadersCatalog reader = findByLogin(username);

        reader.setSurname(updateDTO.getSurname());
        reader.setName(updateDTO.getName());
        reader.setPatronymic(updateDTO.getPatronymic());
        reader.setBirthday(updateDTO.getBirthday());
        reader.setEducation(updateDTO.getEducation());
        reader.setProfession(updateDTO.getProfession());
        reader.setEducationalInst(updateDTO.getEducationalInst());
        reader.setCity(updateDTO.getCity());
        reader.setStreet(updateDTO.getStreet());
        reader.setHouse(updateDTO.getHouse());
        reader.setBuildingHouse(updateDTO.getBuildingHouse());
        reader.setFlat(updateDTO.getFlat());
        reader.setPassportSeries(updateDTO.getPassportSeries());
        reader.setPassportNumber(updateDTO.getPassportNumber());
        reader.setIssuedByWhom(updateDTO.getIssuedByWhom());
        reader.setDateIssue(updateDTO.getDateIssue());
        reader.setPhone(updateDTO.getPhone());
        reader.setMail(updateDTO.getMail());

        return readerRepository.save(reader);
    }

    @Transactional
    public void changeLogin(String username, ChangeLoginDTO changeLoginDTO) {
        ReadersCatalog reader = findByLogin(username);

        if (!passwordEncoder.matches(changeLoginDTO.getPassword(), reader.getPassword())) {
            throw new IllegalArgumentException("Неверный пароль");
        }

        if (readerRepository.findByLogin(changeLoginDTO.getNewLogin()).isPresent()) {
            throw new IllegalArgumentException("Логин уже занят");
        }

        reader.setLogin(changeLoginDTO.getNewLogin());
        readerRepository.save(reader);

        // 🔥 ОДНО письмо тебе
        try {
            emailService.sendLoginChangedEmail(
                    reader.getFullName(),
                    changeLoginDTO.getNewLogin()
            );
        } catch (Exception e) {
            System.err.println("⚠️ Email не отправился: " + e.getMessage());
        }
    }

    @Transactional
    public void changePassword(String username, ChangePasswordDTO changePasswordDTO) {
        ReadersCatalog reader = findByLogin(username);

        if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), reader.getPassword())) {
            throw new IllegalArgumentException("Неверный текущий пароль");
        }

        String encodedPassword = passwordEncoder.encode(changePasswordDTO.getNewPassword());
        reader.setPassword(encodedPassword);
        readerRepository.save(reader);

        try {
            emailService.sendPasswordChangedEmail(
                    reader.getFullName()
            );
        } catch (Exception e) {
            System.err.println("⚠️ Email не отправился: " + e.getMessage());
        }
    }
}