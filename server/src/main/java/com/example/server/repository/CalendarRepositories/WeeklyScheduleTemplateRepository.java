package com.example.server.repository.CalendarRepositories;

import com.example.server.models.CalendarModels.WeeklyScheduleTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeeklyScheduleTemplateRepository extends JpaRepository<WeeklyScheduleTemplate,Long> {

    List<WeeklyScheduleTemplate> findByDoctorId(Long doctorId);


}
