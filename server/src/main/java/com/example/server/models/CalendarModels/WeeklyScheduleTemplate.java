package com.example.server.models.CalendarModels;


import com.example.server.models.UserModels.Doctor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
@Entity
public class WeeklyScheduleTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    private boolean working;

    private LocalTime startTime;
    private LocalTime endTime;

    private int slotDurationMinutes;

}
