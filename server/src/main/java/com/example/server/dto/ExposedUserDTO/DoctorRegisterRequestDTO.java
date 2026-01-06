package com.example.server.dto.ExposedUserDTO;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class DoctorRegisterRequestDTO {

    private Long id;
    private String firstName;
    private String lastName;

    private String email;
    private String password;

    private Integer age;

    private LocalDate birthDate;

    private String phoneNumber;
    private String role;

    private String subscription = "free";

    private String subscriptionType;

    private LocalDate subscriptionExpiry;

    private LocalDate created_at = LocalDate.now();

    private String photoURL;

    private static final String DEFAULT_PHOTO_URL = "https://res.cloudinary.com/dfnja74fz/image/upload/v1764666223/pngtree-vector-doctor-icon-png-image_1024938_mfcymu.jpg";

    private String specialization;

    private int yearsOfExperience;

    private String city;

    private Float rating;

    private String hospital;

    private Status status = Status.PENDING;

    public enum Status { PENDING, ACCEPTED, DENIED }
} 