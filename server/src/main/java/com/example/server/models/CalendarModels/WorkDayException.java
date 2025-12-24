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

    private LocalDate date;

    private Boolean working;

    private LocalTime overrideStartTime;
    private LocalTime overrideEndTime;
}
