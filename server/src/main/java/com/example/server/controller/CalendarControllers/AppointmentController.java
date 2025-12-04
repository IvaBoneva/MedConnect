package com.example.server.controller.CalendarControllers;

import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.dto.CalendarDTO.AppointmentFilterDTO;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.service.CalendarServices.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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

    @GetMapping("/doctor")
    public List<Appointment> getDoctorAppointments(@RequestParam Long doctorId,
                                                   @RequestParam Appointment.Status status) {
        return service.getDoctorAppointments(doctorId, status);
    }

    @GetMapping("/pastUserAppointments")
    public List<Appointment> getPastUserAppointments(@RequestParam Long doctorId,
                                                     @RequestParam Appointment.Status status,
                                                     @RequestParam Long patientId) {
        return service.getDoctorAppointmentToUser(doctorId, status, patientId);
    }

    @PatchMapping("/{id}/feedback")
    public ResponseEntity<?> updateFeedback(
            @PathVariable Long id,
            @RequestBody String feedback
    ) {
        service.updateFeedback(id, feedback);
        return ResponseEntity.ok("Feedback updated");
    }


}
