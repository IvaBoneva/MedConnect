package com.example.server.dto.CalendarDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GuardianCalendarDTO {

    private Long guardianId;
    private String wardFirstName;
    private String wardLastName;
    private Integer wardAge;
    private String wardAllergies;
    private String wardDiseases;
}