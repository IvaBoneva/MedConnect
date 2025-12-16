package com.example.server.controller.CalendarControllers;

import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.dto.CalendarDTO.AppointmentFilterDTO;
import com.example.server.dto.CalendarDTO.AppointmentReviewableDTO;
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
                    .status(HttpStatus.BAD_REQUEST) // HTTP status 400
                    .body(e.getMessage());
        }
    }

    // В AppointmentController.java

    @GetMapping("/doctor")
    public ResponseEntity<List<AppointmentReviewableDTO>> getDoctorAppointments(
            @RequestParam Long doctorId,
            @RequestParam Appointment.Status status) {

        List<Appointment> appointments = service.getDoctorAppointments(doctorId, status);

        List<AppointmentReviewableDTO> dtos = appointments.stream()
                .map(appointment -> {
                    AppointmentReviewableDTO dto = new AppointmentReviewableDTO();

                    dto.setId(appointment.getId());
                    dto.setStartTime(appointment.getStartingTime());
                    dto.setFeedback(appointment.getFeedback());

                    if (appointment.getPatient() != null) {
                        dto.setPatientName(appointment.getPatient().getFirstName());
                        dto.setPatientSurname(appointment.getPatient().getLastName());
                    } else if (appointment.getGuardian() != null) {
                        dto.setPatientName(appointment.getGuardian().getFirstName());
                        dto.setPatientSurname(appointment.getGuardian().getLastName());
                    }

                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/pastUserAppointments")
    public ResponseEntity<List<AppointmentReviewableDTO>> getPastUserAppointments(
            @RequestParam Long doctorId,
            @RequestParam Appointment.Status status,
            @RequestParam Long patientId) {

        List<Appointment> appointments = service.getDoctorAppointmentToUser(doctorId, status, patientId);

        List<AppointmentReviewableDTO> dtos = appointments.stream()
                .map(appointment -> {
                    AppointmentReviewableDTO dto = new AppointmentReviewableDTO();

                    dto.setId(appointment.getId());
                    dto.setStartTime(appointment.getStartingTime());
                    dto.setFeedback(appointment.getFeedback());

                    if (appointment.getPatient() != null) {
                        dto.setPatientName(appointment.getPatient().getFirstName());
                        dto.setPatientSurname(appointment.getPatient().getLastName());
                    } else if (appointment.getGuardian() != null) {
                        dto.setPatientName(appointment.getGuardian().getFirstName());
                        dto.setPatientSurname(appointment.getGuardian().getLastName());
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/{id}/feedback")
    public ResponseEntity<?> updateFeedback(
            @PathVariable Long id,
            @RequestBody String feedback) {
        service.updateFeedback(id, feedback);
        return ResponseEntity.ok("Feedback updated");
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id) {
        try {
            service.completeAppointment(id);
            return ResponseEntity.ok("Appointment marked as completed.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
