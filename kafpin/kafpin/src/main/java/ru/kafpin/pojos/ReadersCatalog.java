package ru.kafpin.pojos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Readers_catalog", schema = "kursovaya")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReadersCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "patronymic")
    private String patronymic;

    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @Column(name = "education", nullable = false)
    private String education;

    @Column(name = "profession")
    private String profession;

    @Column(name = "educational_inst")
    private String educationalInst;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "street", nullable = false)
    private String street;

    @Column(name = "house", nullable = false)
    private Integer house;

    @Column(name = "building_house")
    private String buildingHouse;

    @Column(name = "flat")
    private Integer flat;

    @Column(name = "passport_series", nullable = false)
    private Integer passportSeries;

    @Column(name = "passport_number", nullable = false)
    private Integer passportNumber;

    @Column(name = "issued_by_whom", nullable = false)
    private String issuedByWhom;

    @Column(name = "date_issue", nullable = false)
    private LocalDate dateIssue;

    @Column(name = "consists_of", nullable = false)
    private LocalDate consistsOf;

    @Column(name = "re_registration")
    private LocalDate reRegistration;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "login", nullable = false, unique = true)
    private String login;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "mail", nullable = false, unique = true)
    private String mail;

    @Column(name = "admin", nullable = false)
    private Boolean admin = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "reader")
    @JsonIgnore
    private List<BookingCatalog> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Comments> comments = new ArrayList<>();

    @OneToMany(mappedBy = "reader")
    @JsonIgnore
    private List<OrderCatalog> orders = new ArrayList<>();

    public String getFullName() {
        String fullName = surname + " " + name;
        if (patronymic != null && !patronymic.trim().isEmpty()) {
            fullName += " " + patronymic;
        }
        return fullName.trim();
    }
}