package com.example.server.dto.CalendarDTO;

import com.example.server.models.UserModels.Doctor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class PatientAppointmentDTO {

    public LocalDateTime start;
    public LocalDateTime end;
    public String status;
    public PatientCalendarDTO patient;
    public Doctor doctor;
    public String comment;

    public PatientAppointmentDTO(LocalDateTime start, LocalDateTime end, String status, PatientCalendarDTO patient, String comment,Doctor doctor) {
        this.start = start;
        this.end = end;
        this.status = status;
        this.patient = patient;
        this.comment = comment;
        this.doctor = doctor;
    }




}
