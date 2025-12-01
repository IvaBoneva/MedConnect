package com.example.server.dto.CalendarDTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class CalendarDayDTO {

    public LocalDate date;
    public boolean working;
    public LocalTime startTime;
    public LocalTime endTime;
    public List<AppointmentDTO> appointments;


}
