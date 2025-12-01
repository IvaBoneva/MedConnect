package com.example.server.controller.CalendarControllers;

import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.service.CalendarServices.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentCreateDTO dto) {
        Appointment appt = service.createAppointment(dto);
        return ResponseEntity.ok(appt);
    }

}
