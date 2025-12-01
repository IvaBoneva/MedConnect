package com.example.server.models.CalendarModels;


import com.example.server.models.UserModels.Doctor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
public class WorkDayException {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Doctor doctor;

    // The specific date being changed
    private LocalDate date;

    // If doctor is working this date (null = follow template)
    private Boolean working;

    // Override start/end (null = follow template)
    private LocalTime overrideStartTime;
    private LocalTime overrideEndTime;
}
