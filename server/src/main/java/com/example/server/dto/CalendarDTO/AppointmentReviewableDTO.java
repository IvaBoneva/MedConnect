package com.example.server.dto.CalendarDTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentReviewableDTO {
    private Long Id;

    private LocalDateTime startTime;

    private String feedback;

    private Integer rating;

    private String patientName;

    private String patientSurname;
}