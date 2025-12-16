package com.example.server.models;

import com.example.server.models.UserModels.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionEvents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private LocalDateTime startDateTime;   // Use LocalDateTime for proper time formatting
    private LocalDateTime endDateTime;
    private String takingHours;

    @ManyToOne(fetch = FetchType.LAZY)  // Lazy fetch for the User
    @JoinColumn(name = "users", nullable = false)
    @JsonIgnore  // Prevent infinite recursion or serialization issues
    private User user;




}
