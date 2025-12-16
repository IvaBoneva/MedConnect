package com.example.server.dto.CalendarDTO;

import com.example.server.models.UserModels.Doctor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class GuardianAppointmentDTO {

    private LocalDateTime start;
    private LocalDateTime end;
    private String status;
    private GuardianCalendarDTO guardian;
    private Doctor doctor;
    private String comment;

    public GuardianAppointmentDTO(
            LocalDateTime start,
            LocalDateTime end,
            String status,
            GuardianCalendarDTO guardian,
            String comment,
            Doctor doctor
    ) {
        this.start = start;
        this.end = end;
        this.status = status;
        this.guardian = guardian;
        this.comment = comment;
        this.doctor = doctor;
    }
}
