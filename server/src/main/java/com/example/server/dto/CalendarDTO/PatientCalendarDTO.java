package com.example.server.dto.CalendarDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientCalendarDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;

    private String allergies;
    private String diseases;
}
