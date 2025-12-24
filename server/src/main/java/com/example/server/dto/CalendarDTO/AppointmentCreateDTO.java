package com.example.server.dto.CalendarDTO;

import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Patient;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AppointmentCreateDTO {

    private Long doctorId;
    private Long patientId;
    private Long guardianId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    @JsonFormat(pattern = "HH:mm")     
    private LocalTime start;

    private String comment;


}