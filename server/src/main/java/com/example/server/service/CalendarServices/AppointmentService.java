package com.example.server.service.CalendarServices;

import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Patient;
import com.example.server.repository.CalendarRepositories.AppointmentRepository;
import com.example.server.repository.UserRepositories.DoctorRepository;
import com.example.server.repository.UserRepositories.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository) {

        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    public Appointment createAppointment(AppointmentCreateDTO dto) {

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appt = new Appointment();

        // Build LocalDateTime from date + start
        LocalDateTime starting = LocalDateTime.of(dto.getDate(), dto.getStart());
        appt.setStartingTime(starting);

        // Duration is always 30 minutes, endTime computed automatically
        appt.setDurationInMinutes(30L);

        appt.setStatus(Appointment.Status.Requested);

        // Default status for new appointment
        appt.setStatus(Appointment.Status.Booked); // OR Requested if you add it

        appt.setDoctor(doctor);
        appt.setPatient(patient);
        appt.setComment(dto.getComment());

        return appointmentRepository.save(appt);
    }
}
