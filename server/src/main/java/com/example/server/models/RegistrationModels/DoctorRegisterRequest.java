package com.example.server.models.RegistrationModels;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.time.Period;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "doctor_register_request")
public class DoctorRegisterRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;
    private String password;

    private Integer age;

    @Column
    private LocalDate birthDate;

    private String phoneNumber;
    private String role;

    @Column
    private String subscription = "free";

    @Column
    private String subscriptionType;

    @Column
    private LocalDate subscriptionExpiry;

    private LocalDate created_at = LocalDate.now();

    private String photoURL;

    private static final String DEFAULT_PHOTO_URL = "https://res.cloudinary.com/dfnja74fz/image/upload/v1764666223/pngtree-vector-doctor-icon-png-image_1024938_mfcymu.jpg";

    private String specialization;

    private int yearsOfExperience;

    private String city;

    private Float rating;

    private String hospital;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    public enum Status { PENDING, ACCEPTED, DENIED }


}