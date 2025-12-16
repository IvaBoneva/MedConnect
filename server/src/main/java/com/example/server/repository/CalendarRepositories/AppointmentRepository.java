package com.example.server.repository.CalendarRepositories;

import com.example.server.models.CalendarModels.Appointment;
import com.twilio.type.App;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctorIdAndStartingTimeBetween(
            Long doctorId,
            LocalDateTime from,
            LocalDateTime to
    );

    boolean existsByDoctorIdAndStartingTime(Long doctorId, LocalDateTime startingTime);

    List<Appointment> findByPatientIdAndStatus(Long patientId, Appointment.Status status);

    List<Appointment> findByDoctorIdAndStatusAndFeedbackIsNotNull(Long doctorId, Appointment.Status status);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = ?1 AND a.status = ?2 AND a.patient.id = ?3 AND a.feedback IS NULL")
    List<Appointment> findByDoctorIdAndPatientIdAndStatusNullCustomQuery(Long doctorId, Appointment.Status status, Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = ?1 AND a.status = ?2 AND a.guardian.id = ?3 AND a.feedback IS NULL")
    List<Appointment> findByDoctorIdAndGuardianIdAndStatusNullCustomQuery(Long doctorId, Appointment.Status status, Long guardianId);

}
