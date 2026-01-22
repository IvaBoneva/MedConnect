package com.example.server.mappers;


import com.example.server.dto.CalendarDTO.*;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.UserModels.Guardian;

import java.time.LocalDateTime;


public class AppointmentMapper {

    private AppointmentMapper() {}

    /* ===================== PATIENT ===================== */

    public static PatientAppointmentDTO toPatientDTO(Appointment appointment) {

        PatientCalendarDTO patientDTO = new PatientCalendarDTO(
                appointment.getPatient().getId(),
                appointment.getPatient().getFirstName(),
                appointment.getPatient().getLastName(),
                appointment.getPatient().getPhoneNumber(),
                appointment.getPatient().getAllergies(),
                appointment.getPatient().getDiseases(),
                appointment.getPatient().getDisabilities()
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

    /* ===================== GUARDIAN ===================== */

    public static GuardianAppointmentDTO toGuardianDTO(Appointment appointment) {

        Guardian guardian = appointment.getGuardian();

        GuardianCalendarDTO guardianDTO = new GuardianCalendarDTO(
                guardian.getId(),
                guardian.getWardFirstName(),
                guardian.getWardLastName(),
                guardian.getWardAge(),
                guardian.getWardAllergies(),
                guardian.getWardDiseases()
        );

        LocalDateTime start = appointment.getStartingTime();
        LocalDateTime end = appointment.getEndTime();

        return new GuardianAppointmentDTO(
                start,
                end,
                appointment.getStatus().name(),
                guardianDTO,
                appointment.getComment(),
                appointment.getDoctor()
        );
    }
}