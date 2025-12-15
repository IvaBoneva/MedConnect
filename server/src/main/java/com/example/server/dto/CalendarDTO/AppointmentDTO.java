package com.example.server.dto.CalendarDTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class AppointmentDTO {
    private Long id;
    public LocalTime start;
    public LocalTime end;
    public String status;

    public AppointmentDTO(Long id, LocalTime start, LocalTime end, String status, PatientCalendarDTO patient, String comment) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.status = status;
        this.patient = patient;
        this.comment = comment;
    }

    private PatientCalendarDTO patient;

    private String comment;

}