package com.example.server.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionDTO {

    private Long id;

    private String medicationName;

    private String dosage;

    private String frequency;

    private String prescribingDoctor;

    private LocalDate takingHour;

    private Long userId;

}*/

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionDTO {

    private Long id;

    private String medicationName;

    private String dosage;

    private String frequency;

    private String prescribingDoctor;

    private String takingHour; // променено на String

    private Long userId;

}

