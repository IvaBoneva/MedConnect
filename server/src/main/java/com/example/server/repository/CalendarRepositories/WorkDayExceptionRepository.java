package com.example.server.repository.CalendarRepositories;

import com.example.server.models.CalendarModels.WeeklyScheduleTemplate;
import com.example.server.models.CalendarModels.WorkDayException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkDayExceptionRepository extends JpaRepository<WorkDayException,Long> {

    List<WorkDayException> findByDoctorId(Long doctorId);

    WorkDayException findByDoctorIdAndDate(Long doctorId, LocalDate date);

    List<WorkDayException> findByDoctorIdAndDateBetween(Long doctorId, LocalDate startDate, LocalDate endDate);

}
