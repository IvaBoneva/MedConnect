package com.example.server.service.CalendarServices;

import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Patient;
import com.example.server.repository.CalendarRepositories.AppointmentRepository;
import com.example.server.repository.UserRepositories.DoctorRepository;
import com.example.server.repository.UserRepositories.PatientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
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

        LocalDateTime startingTime = LocalDateTime.of(dto.getDate(), dto.getStart());


        boolean appointmentExists = appointmentRepository.existsByDoctorIdAndStartingTime(dto.getDoctorId(),startingTime);

        if (appointmentExists) {
            throw new RuntimeException("Appointment already exists at this time.");
        }

        Appointment appt = new Appointment();

        // Build LocalDateTime from date + start
        LocalDateTime starting = LocalDateTime.of(dto.getDate(), dto.getStart());
        appt.setStartingTime(starting);

        // Duration is always 30 minutes, endTime computed automatically
        appt.setDurationInMinutes(30L);

//        appt.setStatus(Appointment.Status.Requested);

        // Default status for new appointment
//        appt.setStatus(Appointment.Status.Booked); // OR Requested if you add it
        appt.setStatus(Appointment.Status.Completed);

        appt.setDoctor(doctor);
        appt.setPatient(patient);
        appt.setComment(dto.getComment());

        return appointmentRepository.save(appt);
    }

    public List<Appointment> getDoctorAppointments(Long doctorId, Appointment.Status status){
        return appointmentRepository.findByDoctorIdAndStatusAndFeedbackIsNotNull(doctorId, status);
    }

    public List<Appointment> getDoctorAppointmentToUser(Long doctorId, Appointment.Status status, Long patientId){
        return appointmentRepository.findByDoctorIdAndPatientIdAndStatusNullCustomQuery(doctorId, status, patientId);
    }

    public void updateFeedback(Long id, String feedback) {
        Appointment a = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        a.setFeedback(feedback);
        appointmentRepository.save(a);
    }

    public List<Appointment> getPatientAppointments(Long patientId){
        return appointmentRepository.findByPatientIdAndStatus(patientId, Appointment.Status.Booked);
    }
}
