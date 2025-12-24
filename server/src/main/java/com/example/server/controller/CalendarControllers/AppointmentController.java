package com.example.server.controller.CalendarControllers;

import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.dto.CalendarDTO.AppointmentFilterDTO;
import com.example.server.dto.CalendarDTO.AppointmentReviewableDTO;
import com.example.server.dto.ReviewRequestDTO;
import com.example.server.dto.CalendarDTO.*;
import com.example.server.mappers.AppointmentMapper;
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
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    @GetMapping("/doctor")
    public ResponseEntity<List<AppointmentReviewableDTO>> getDoctorAppointments(
            @RequestParam Long doctorId,
            @RequestParam Appointment.Status status) {

//        gets Compleated apppointments
        List<Appointment> appointments = service.getDoctorAppointments(doctorId, status);

        List<AppointmentReviewableDTO> dtos = appointments.stream()
                .map(appointment -> {
                    AppointmentReviewableDTO dto = new AppointmentReviewableDTO();

                    dto.setId(appointment.getId());
                    dto.setStartTime(appointment.getStartingTime());
                    dto.setFeedback(appointment.getFeedback());
                    dto.setRating(appointment.getRating());

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

//        returns completed appointments related to current user and selected doctor
        List<Appointment> appointments = service.getDoctorAppointmentToUser(doctorId, status, patientId);
        System.out.println(appointments);
        List<AppointmentReviewableDTO> dtos = appointments.stream()
                .map(appointment -> {
                    AppointmentReviewableDTO dto = new AppointmentReviewableDTO();

                    dto.setId(appointment.getId());
                    dto.setStartTime(appointment.getStartingTime());
                    dto.setFeedback(appointment.getFeedback());
                    dto.setRating(appointment.getRating());

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
            @RequestBody ReviewRequestDTO reviewRequestDTO) {
        service.updateFeedback(id, reviewRequestDTO.getFeedback(), reviewRequestDTO.getRating());
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
    public ResponseEntity<List<PatientAppointmentDTO>> getPatientAppointments(
            @PathVariable Long patientId
    ) {
        List<Appointment> appointmentList = service.getPatientAppointments(patientId);

        List<PatientAppointmentDTO> dtos = appointmentList.stream()
                .map(AppointmentMapper::toPatientDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/statistics/{doctorId}")
    public ResponseEntity<?> getAppointmentStatistics(@PathVariable Long doctorId) {
        return ResponseEntity.ok(service.getAppointmentStatistics(doctorId));
    }
    
    @GetMapping("/guardian/{guardianId}")
    public ResponseEntity<List<GuardianAppointmentDTO>> getGuardianAppointments(
            @PathVariable Long guardianId
    ) {
        List<Appointment> appointmentList = service.getGuardianAppointments(guardianId);

        List<GuardianAppointmentDTO> dtos = appointmentList.stream()
                .map(AppointmentMapper::toGuardianDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

}
