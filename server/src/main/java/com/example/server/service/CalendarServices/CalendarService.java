package com.example.server.service.CalendarServices;


import com.example.server.dto.CalendarDTO.AppointmentDTO;
import com.example.server.dto.CalendarDTO.CalendarDayDTO;
import com.example.server.dto.CalendarDTO.WorkDayExceptionDTO;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.CalendarModels.WeeklyScheduleTemplate;
import com.example.server.models.CalendarModels.WorkDayException;
import com.example.server.models.UserModels.Doctor;
import com.example.server.repository.CalendarRepositories.AppointmentRepository;
import com.example.server.repository.CalendarRepositories.WeeklyScheduleTemplateRepository;
import com.example.server.repository.CalendarRepositories.WorkDayExceptionRepository;
import com.example.server.repository.UserRepositories.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final WeeklyScheduleTemplateRepository weeklyRepo;
    private final WorkDayExceptionRepository exceptionRepo;
    private final AppointmentRepository appointmentRepo;
    private final DoctorRepository doctorRepository;

    public List<CalendarDayDTO> getDoctorCalendar(Long doctorId, LocalDate from, LocalDate to){

        if (from == null || to == null || from.isAfter(to)) {
            return List.of(); // return empty safely
        }

        List<WeeklyScheduleTemplate> template =
                weeklyRepo.findByDoctorId(doctorId);


        List<WorkDayException> exceptions =
                exceptionRepo.findByDoctorId(doctorId);

        List<Appointment> appointments =
                appointmentRepo.findByDoctorIdAndStartingTimeBetween(
                        doctorId,
                        from.atStartOfDay(),
                        to.plusDays(1).atStartOfDay()
                );


        if (template.isEmpty()) {
            return Collections.emptyList();  // doctor has no schedule → no events
        }

        Map<DayOfWeek, WeeklyScheduleTemplate> templateMap = template.stream()
                .collect(Collectors.toMap(
                        WeeklyScheduleTemplate::getDayOfWeek,
                        t -> t
                ));

        Map<LocalDate, WorkDayException> exceptionMap = exceptions.stream()
                .collect(Collectors.toMap(
                        WorkDayException::getDate,
                        e -> e
                ));

        List<CalendarDayDTO> result = new ArrayList<>();

        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {

            CalendarDayDTO dto = new CalendarDayDTO();
            dto.setDate(d);

            WorkDayException ex = exceptionMap.get(d);
            WeeklyScheduleTemplate base = templateMap.get(d.getDayOfWeek());

            if (base == null) continue;

            // STEP 5 — Pick which schedule to use
            if (ex != null) {

                if (Boolean.FALSE.equals(ex.getWorking())) {
                    dto.setWorking(false);
                    result.add(dto);
                    continue;
                }

                dto.setWorking(true);
                dto.setStartTime(ex.getOverrideStartTime() != null ? ex.getOverrideStartTime() : base.getStartTime());
                dto.setEndTime(ex.getOverrideEndTime() != null ? ex.getOverrideEndTime() : base.getEndTime());

            } else {
                dto.setWorking(base.isWorking());
                dto.setStartTime(base.getStartTime());
                dto.setEndTime(base.getEndTime());
            }

            // STEP 6 — Add appointments
            LocalDate finalD = d;
            List<AppointmentDTO> appointmentDTOs = appointments.stream()
                    .filter(a -> a.getStartingTime().toLocalDate().equals(finalD))
                    .map(a -> new AppointmentDTO(
                            a.getStartingTime().toLocalTime(),
                            a.getEndTime().toLocalTime(),
                            a.getStatus().name(),
                            a.getPatient(),
                            a.getComment()
                    ))
                    .toList();

            dto.setAppointments(appointmentDTOs);

            result.add(dto);
        }

        return result;

    }

    public void setDayOff(Long doctorId , LocalDate date){

        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));
        WorkDayException existingException = exceptionRepo.findByDoctorIdAndDate(doctorId, date);

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59, 999999999);

        List<Appointment> appointments = appointmentRepo.findByDoctorIdAndStartingTimeBetween(
                doctorId, startOfDay, endOfDay);

        if (!appointments.isEmpty()) {
            // If there are appointments during this period, throw an exception and do not allow setting the day off
            throw new RuntimeException("Cannot set the day off because there are existing appointments between 00:00 AM and 12:00 PM.");
        }

        if (existingException != null) {
            // If an exception already exists, set it as "off"
            existingException.setWorking(false);
            exceptionRepo.save(existingException);  // Save the updated exception
        } else {
            // If no exception exists, create a new one
            WorkDayException newException = new WorkDayException();
            newException.setDoctor(doctor);
            newException.setDate(date);
            newException.setWorking(false);  // Mark the day as off
            exceptionRepo.save(newException);  // Save the new exception
        }

    }

    public void updateWorkDayException(Long doctorId, WorkDayExceptionDTO workDayExceptionDTO) {
        // Print to check if the method is being called
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        // Get the existing WorkDayException (this assumes you're passing the doctor's ID and date in the request)

        WorkDayException existingException = exceptionRepo.findByDoctorIdAndDate(doctorId, workDayExceptionDTO.getDate());

        // Convert the given date and start/end times to LocalDateTime
        LocalDate date = workDayExceptionDTO.getDate();

        LocalTime newStartTime = workDayExceptionDTO.getOverrideStartTime();
        LocalTime newEndTime = workDayExceptionDTO.getOverrideEndTime();

        LocalTime startOfWorkingDay = LocalTime.of(9, 0);
        LocalTime endOfWorkingDay = LocalTime.of(17, 0);

        LocalDateTime newStartDateTime = newStartTime != null ? date.atTime(newStartTime) : null;
        LocalDateTime newEndDateTime = newEndTime != null ? date.atTime(newEndTime) : null;




// Debugging the combined LocalDateTime values

// Check if the existing exception is found
        if (existingException != null) {
            // Debugging the existing exception times

            // Update only the fields that are non-null and have changed
            if (workDayExceptionDTO.getWorking() != null) {
                existingException.setWorking(workDayExceptionDTO.getWorking());
            }

            if (workDayExceptionDTO.getOverrideStartTime() != null) {
                existingException.setOverrideStartTime(workDayExceptionDTO.getOverrideStartTime());
            }

            if (workDayExceptionDTO.getOverrideEndTime() != null) {
                existingException.setOverrideEndTime(workDayExceptionDTO.getOverrideEndTime());
            }

            // Save the updated exception
            exceptionRepo.save(existingException);
        } else {
            // If the exception does not exist, create a new one

            if (!isAppointmentInRange(doctorId, newStartDateTime,newEndDateTime )) {
                throw new RuntimeException("Cannot set the new working hours because there are existing appointments before the new start time.");
            }

            WorkDayException newException = new WorkDayException();
            newException.setDate(workDayExceptionDTO.getDate());
            newException.setWorking(workDayExceptionDTO.getWorking() != null ? workDayExceptionDTO.getWorking() : false);
            newException.setOverrideStartTime(workDayExceptionDTO.getOverrideStartTime());
            newException.setOverrideEndTime(workDayExceptionDTO.getOverrideEndTime());
            newException.setDoctor(doctor);

            exceptionRepo.save(newException);
        }
    }

    private boolean isAppointmentInRange(Long doctorId, LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            return false;
        }

        LocalDate startDate = start.toLocalDate();  // Extract date from the start LocalDateTime
        LocalDateTime startOfDay = startDate.atTime(0, 0);  // 00:00:00
        LocalDateTime endOfDay = startDate.atTime(23, 59, 59);
        // Check for appointments within the specified range
        List<Appointment> appointments = appointmentRepo.findByDoctorIdAndStartingTimeBetween(doctorId, start, end);
        List<Appointment> allDayAppoinments = appointmentRepo.findByDoctorIdAndStartingTimeBetween(doctorId, startOfDay, endOfDay);

        System.out.println(appointments);
        return appointments.size() == allDayAppoinments.size();
    }

}
