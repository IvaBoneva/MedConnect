package com.example.server.models.UserModels;

import com.example.server.models.MedicalActionsModels.MedicalProcedure;
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
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

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

    private String googleAccessToken;

    private String googleRefreshToken;

    @ManyToMany(mappedBy = "users")
    private Set<MedicalProcedure> medicalProcedureSet;

}
