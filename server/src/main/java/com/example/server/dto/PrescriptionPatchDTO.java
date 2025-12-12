package com.example.server.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrescriptionPatchDTO {

    private String medicationName;
    private String dosage;
    private LocalDate startDate;
    private LocalDate endDate;
    private String prescribingDoctor;
    private String takingHour;

}
