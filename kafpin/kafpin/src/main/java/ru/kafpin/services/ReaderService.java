package ru.kafpin.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kafpin.dtos.*;
import ru.kafpin.exceptions.RegistrationException;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.repositories.ReadersCatalogRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReaderService {

    private final ReadersCatalogRepository readerRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReadersCatalogDetailsService readersCatalogDetailsService;
    private final EmailService emailService; // 🔥 НОВОЕ: Внедряем EmailService

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

    @Transactional
    public UserResponse register(RegistrationRequestDTO request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RegistrationException("Пароли не совпадают");
        }

        if (readerRepository.findByLogin(request.getLogin()).isPresent()) {
            throw new RegistrationException("Логин уже занят");
        }

        if (readerRepository.findByMail(request.getMail()).isPresent()) {
            throw new RegistrationException("Почта уже занята");
        }

        if (readerRepository.existsByPassportSeriesAndPassportNumber(
                request.getPassportSeries(), request.getPassportNumber())) {
            throw new RegistrationException("Паспорт уже зарегистрирован");
        }

        ReadersCatalog reader = new ReadersCatalog();
        reader.setSurname(request.getSurname());
        reader.setName(request.getName());
        reader.setPatronymic(request.getPatronymic());
        reader.setBirthday(request.getBirthday());
        reader.setEducation(request.getEducation());
        reader.setProfession(request.getProfession());
        reader.setEducationalInst(request.getEducationalInst());
        reader.setCity(request.getCity());
        reader.setStreet(request.getStreet());
        reader.setHouse(request.getHouse());
        reader.setBuildingHouse(request.getBuildingHouse());
        reader.setFlat(request.getFlat());
        reader.setPassportSeries(request.getPassportSeries());
        reader.setPassportNumber(request.getPassportNumber());
        reader.setIssuedByWhom(request.getIssuedByWhom());
        reader.setDateIssue(request.getDateIssue());
        reader.setConsistsOf(LocalDate.now());
        reader.setReRegistration(null);
        reader.setPhone(request.getPhone());
        reader.setLogin(request.getLogin());
        reader.setPassword(passwordEncoder.encode(request.getPassword()));
        reader.setMail(request.getMail());
        reader.setAdmin(false);
        reader.setIsActive(true);

        ReadersCatalog saved = readerRepository.save(reader);
        return mapToUserResponse(saved);
    }

    private UserResponse mapToUserResponse(ReadersCatalog reader) {
        return UserResponse.builder()
                .id(reader.getId())
                .login(reader.getLogin())
                .displayName(reader.getFullName())
                .isActive(reader.getIsActive())
                .isAdmin(reader.getAdmin())
                .build();
    }
}