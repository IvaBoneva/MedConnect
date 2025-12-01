package com.example.server.models.CalendarModels;

import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Patient;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The exact start date + time
    private LocalDateTime startingTime;

    // Duration in minutes
    private Long durationInMinutes = 30L;

    // Auto-generated
    private LocalDateTime endTime;

    @PrePersist
    @PreUpdate
    public void computeEndTime() {
        this.endTime = startingTime.plus(Duration.ofMinutes(durationInMinutes));
    }

    // Appointment status
    @Enumerated(EnumType.STRING)
    private Status status = Status.Free;

    @ManyToOne
    private Doctor doctor;

    @ManyToOne
    private Patient patient;

    public enum Status {
        Free,
        Booked,
        Completed,
        Cancelled,
        Requested
    }

    private String comment;
}