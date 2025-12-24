package com.example.server.service.CalendarServices;

import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Guardian;
import com.example.server.models.UserModels.Patient;
import com.example.server.repository.CalendarRepositories.AppointmentRepository;
import com.example.server.repository.UserRepositories.DoctorRepository;
import com.example.server.repository.UserRepositories.GuardianRepository;
import com.example.server.repository.UserRepositories.PatientRepository;
import lombok.extern.slf4j.Slf4j;
import com.twilio.type.App;

import org.springframework.stereotype.Service;

import java.security.Guard;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final GuardianRepository guardianRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository, GuardianRepository guardianRepository) {

        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.guardianRepository = guardianRepository;
    }

    public Appointment createAppointment(AppointmentCreateDTO dto) {

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appt = new Appointment();

        Optional<Patient> patientOpt = patientRepository.findById(dto.getPatientId());

        if (patientOpt.isPresent()) {

            appt.setPatient(patientOpt.get());

            appt.setComment(dto.getComment());
        } else {
            Guardian guardian = guardianRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("User not found (ID is neither Patient nor Guardian)"));

            appt.setGuardian(guardian);
            appt.setComment(dto.getComment() != null ? dto.getComment() : "");
        }

        LocalDateTime startingTime = LocalDateTime.of(dto.getDate(), dto.getStart());

        boolean appointmentExists = appointmentRepository.existsByDoctorIdAndStartingTime(dto.getDoctorId(),
                startingTime);
        if (appointmentExists) {
            throw new RuntimeException("Appointment already exists at this time.");
        }

        appt.setStartingTime(startingTime);
        appt.setDurationInMinutes(30L);


        appt.setStatus(Appointment.Status.Booked);
        appt.setDoctor(doctor);

        return appointmentRepository.save(appt);
    }

    public List<Appointment> getDoctorAppointments(Long doctorId, Appointment.Status status) {
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndStatusAndFeedbackIsNotNull(doctorId,
                status);

        return appointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.Completed)
                .toList();
    }

    public List<Appointment> getDoctorAppointmentToUser(Long doctorId, Appointment.Status status, Long userId) {
        List<Appointment> patientAppointments = appointmentRepository
                .findByDoctorIdAndPatientIdAndStatusNullCustomQuery(doctorId, status, userId);

        List<Appointment> guardianAppointments = appointmentRepository
                .findByDoctorIdAndGuardianIdAndStatusNullCustomQuery(doctorId, status, userId);

        List<Appointment> allAppointments = new ArrayList<>(patientAppointments);
        allAppointments.addAll(guardianAppointments);

        return allAppointments.stream().filter(appt -> appt.getStatus() == Appointment.Status.Completed).toList();
    }

    public void updateFeedback(Long id, String feedback, Integer rating) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setFeedback(feedback);

        if (rating != null) {
            appointment.setRating(rating);
        }

        appointmentRepository.save(appointment);
        updateDoctorAverageRating(appointment.getDoctor().getId());
    }

    public void updateDoctorAverageRating(Long doctorId) {
        Double average = appointmentRepository.getAverageRatingByDoctorId(doctorId);

        if (average == null) {
            average = 0.0;
        }

        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new RuntimeException("Doctor not found"));

        float roundedAvg = (float) (Math.round(average * 10.0) / 10.0);

        doctor.setRating(roundedAvg);
        doctorRepository.save(doctor);
    }

    public void completeAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != Appointment.Status.Booked) {
            throw new RuntimeException("Only booked appointments can be marked as completed.");
        }

        appointment.setStatus(Appointment.Status.Completed);
        appointmentRepository.save(appointment);
    }

    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdAndStatus(patientId, Appointment.Status.Booked);
    }

    public Map<String, Long> getAppointmentStatistics(Long doctorId) {
        long totalAppointments = appointmentRepository.countByDoctorId(doctorId);
        long completedAppointments = appointmentRepository.countByDoctorIdAndStatus(doctorId,
                Appointment.Status.Completed);

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalAppointments", totalAppointments);
        stats.put("completedAppointments", completedAppointments);

        return stats;
    }


    public List<Appointment> getGuardianAppointments(Long guardianId){
        return appointmentRepository.findByGuardianIdAndStatus(guardianId, Appointment.Status.Booked);
    }
}
