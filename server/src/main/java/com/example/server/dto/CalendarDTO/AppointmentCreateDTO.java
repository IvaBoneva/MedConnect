package com.example.server.dto.CalendarDTO;

import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Patient;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AppointmentCreateDTO {

    private Long doctorId;
    private Long patientId;

    private LocalDate date;     // yyyy-MM-dd
    private LocalTime start;

    private String comment;


}