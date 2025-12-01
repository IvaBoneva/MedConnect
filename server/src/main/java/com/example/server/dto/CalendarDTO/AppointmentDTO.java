package com.example.server.dto.CalendarDTO;

import com.example.server.models.UserModels.Patient;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;


@Getter
@Setter
public class AppointmentDTO {
    public LocalTime start;
    public LocalTime end;
    public String status;

    public AppointmentDTO(LocalTime start, LocalTime end, String status, Patient patient, String comment) {
        this.start = start;
        this.end = end;
        this.status = status;
        this.patient = patient;
        this.comment = comment;
    }

    private Patient patient;


    private String comment;


}