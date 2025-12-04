package com.example.server.dto.CalendarDTO;

import com.example.server.models.CalendarModels.Appointment;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentFilterDTO {

    private Long doctorId;
    private Appointment.Status status;


}
