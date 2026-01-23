package com.example.server.service.AIDoctorServices;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
public class ConversationContext {
    private Long doctorId;
    private LocalDate date;
    private Long patientId;
}
