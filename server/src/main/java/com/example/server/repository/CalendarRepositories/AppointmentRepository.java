package com.example.server.repository.CalendarRepositories;

import com.example.server.models.CalendarModels.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment,Long> {

    List<Appointment> findByDoctorIdAndStartingTimeBetween(
            Long doctorId,
            LocalDateTime from,
            LocalDateTime to
    );
}
