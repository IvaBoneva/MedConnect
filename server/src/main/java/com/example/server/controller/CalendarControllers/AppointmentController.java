package com.example.server.controller.CalendarControllers;

import com.example.server.dto.CalendarDTO.*;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.service.CalendarServices.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentCreateDTO dto) {

        try {
            Appointment appt = service.createAppointment(dto);
            return ResponseEntity.ok(appt);

        } catch (Exception e) {
            // Create a response with the error message and status BAD_REQUEST (400)
            // You can structure the error response as an object with message and details
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)  // HTTP status 400
                    .body(e.getMessage());
        }
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

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientAppointments(
            @PathVariable Long patientId
    ) {
        List<Appointment> appointmentList = service.getPatientAppointments(patientId);

        List<PatientAppointmentDTO> appointmentDTOList = appointmentList.stream().map(this::convertToDTO).collect(Collectors.toList());

        return ResponseEntity.ok(appointmentDTOList);
    }

    private PatientAppointmentDTO convertToDTO(Appointment appointment) {
        PatientCalendarDTO patientDTO = new PatientCalendarDTO(
                appointment.getPatient().getId(),
                appointment.getPatient().getFirstName(),
                appointment.getPatient().getLastName(),
                appointment.getPatient().getPhoneNumber(),
                appointment.getPatient().getAllergies(),
                appointment.getPatient().getDiseases()
        );

        LocalDateTime start = appointment.getStartingTime();
        LocalDateTime end = appointment.getEndTime();

        return new PatientAppointmentDTO(
                start,
                end,
                appointment.getStatus().name(),
                patientDTO,
                appointment.getComment(),
                appointment.getDoctor()
        );
    }

}
