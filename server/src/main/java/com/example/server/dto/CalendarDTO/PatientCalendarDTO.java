package com.example.server.dto.CalendarDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientCalendarDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;

    private String allergies;
    private String diseases;
}
