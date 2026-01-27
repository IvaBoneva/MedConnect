package com.example.server.service.CalendarServices;

import com.example.server.dto.CalendarDTO.*;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.CalendarModels.WeeklyScheduleTemplate;
import com.example.server.models.CalendarModels.WorkDayException;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Guardian;
import com.example.server.models.UserModels.Patient;
import com.example.server.repository.CalendarRepositories.AppointmentRepository;
import com.example.server.repository.CalendarRepositories.WeeklyScheduleTemplateRepository;
import com.example.server.repository.CalendarRepositories.WorkDayExceptionRepository;
import com.example.server.repository.UserRepositories.DoctorRepository;
import lombok.RequiredArgsConstructor;
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

    public List<CalendarDayDTO> getDoctorCalendar(Long doctorId, LocalDate from, LocalDate to) {

        if (from == null || to == null || from.isAfter(to)) {
            return List.of();
        }

        List<WeeklyScheduleTemplate> template = weeklyRepo.findByDoctorId(doctorId);

        List<WorkDayException> exceptions = exceptionRepo.findByDoctorId(doctorId);

        List<Appointment> appointments = appointmentRepo.findByDoctorIdAndStartingTimeBetween(
                doctorId,
                from.atStartOfDay(),
                to.plusDays(1).atStartOfDay());

        if (template.isEmpty()) {
            return Collections.emptyList();
        }

        Map<DayOfWeek, WeeklyScheduleTemplate> templateMap = template.stream()
                .collect(Collectors.toMap(
                        WeeklyScheduleTemplate::getDayOfWeek,
                        t -> t));

        Map<LocalDate, WorkDayException> exceptionMap = exceptions.stream()
                .collect(Collectors.toMap(
                        WorkDayException::getDate,
                        e -> e));

        List<CalendarDayDTO> result = new ArrayList<>();

        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {

            CalendarDayDTO dto = new CalendarDayDTO();
            dto.setDate(d);

            WorkDayException ex = exceptionMap.get(d);
            WeeklyScheduleTemplate base = templateMap.get(d.getDayOfWeek());

            if (base == null)
                continue;

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

            LocalDate finalD = d;

            List<AppointmentDTO> appointmentDTOs = appointments.stream()
                    .filter(a -> a.getStartingTime().toLocalDate().equals(finalD))
                    .map(a -> {
                        PatientCalendarDTO patientDTO = new PatientCalendarDTO();

                        if (a.getPatient() != null) {
                            Patient p = a.getPatient();
                            patientDTO.setId(p.getId());
                            patientDTO.setFirstName(p.getFirstName());
                            patientDTO.setLastName(p.getLastName());
                            patientDTO.setPhoneNumber(p.getPhoneNumber());
                            patientDTO.setAllergies(p.getAllergies());
                            patientDTO.setDiseases(p.getDiseases());
                        } else if (a.getGuardian() != null) {
                            Guardian g = a.getGuardian();
                            patientDTO.setId(g.getId());
                            patientDTO.setFirstName(g.getFirstName());
                            patientDTO.setLastName(g.getLastName());
                            patientDTO.setPhoneNumber(g.getPhoneNumber());
                            patientDTO.setAllergies("N/A");
                            patientDTO.setDiseases("N/A");
                        }
                        return new AppointmentDTO(
                                a.getId(),
                                a.getStartingTime().toLocalTime(),
                                a.getEndTime().toLocalTime(),
                                a.getStatus().name(),
                                patientDTO,
                                a.getComment());
                    })
                    .toList();

            dto.setAppointments(appointmentDTOs);

            result.add(dto);
        }

        return result;
    }

    public void setDayOff(Long doctorId, LocalDate date) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));
        WorkDayException existingException = exceptionRepo.findByDoctorIdAndDate(doctorId, date);

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59, 999999999);

        List<Appointment> appointments = appointmentRepo.findByDoctorIdAndStartingTimeBetween(
                doctorId, startOfDay, endOfDay);

        if (!appointments.isEmpty()) {
            throw new RuntimeException(
                    "Cannot set the day off because there are existing appointments between 00:00 AM and 12:00 PM.");
        }

        if (existingException != null) {
            existingException.setWorking(false);
            exceptionRepo.save(existingException);
        } else {
            WorkDayException newException = new WorkDayException();
            newException.setDoctor(doctor);
            newException.setDate(date);
            newException.setWorking(false);
            exceptionRepo.save(newException);
        }

    }

    public void updateWorkDayException(Long doctorId, WorkDayExceptionDTO workDayExceptionDTO) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        WorkDayException existingException = exceptionRepo.findByDoctorIdAndDate(doctorId,
                workDayExceptionDTO.getDate());

        LocalDate date = workDayExceptionDTO.getDate();

        LocalTime newStartTime = workDayExceptionDTO.getOverrideStartTime();
        LocalTime newEndTime = workDayExceptionDTO.getOverrideEndTime();

        LocalDateTime newStartDateTime = newStartTime != null ? date.atTime(newStartTime) : null;
        LocalDateTime newEndDateTime = newEndTime != null ? date.atTime(newEndTime) : null;

        if (newStartDateTime != null && newEndDateTime != null) {
            if (!isAppointmentInRange(doctorId, newStartDateTime, newEndDateTime)) {
                throw new RuntimeException(
                        "Cannot set the new working hours because there are existing appointments during this time.");
            }
        }

        if (existingException != null) {
            if (workDayExceptionDTO.getWorking() != null) {
                existingException.setWorking(workDayExceptionDTO.getWorking());
            }

            if (workDayExceptionDTO.getOverrideStartTime() != null) {
                existingException.setOverrideStartTime(workDayExceptionDTO.getOverrideStartTime());
            }

            if (workDayExceptionDTO.getOverrideEndTime() != null) {
                existingException.setOverrideEndTime(workDayExceptionDTO.getOverrideEndTime());
            }

            exceptionRepo.save(existingException);
        } else {

            WorkDayException newException = new WorkDayException();
            newException.setDate(workDayExceptionDTO.getDate());
            newException
                    .setWorking(workDayExceptionDTO.getWorking() != null ? workDayExceptionDTO.getWorking() : false);
            newException.setOverrideStartTime(workDayExceptionDTO.getOverrideStartTime());
            newException.setOverrideEndTime(workDayExceptionDTO.getOverrideEndTime());
            newException.setDoctor(doctor);

            exceptionRepo.save(newException);
        }
    }

    public boolean isAppointmentInRange(Long doctorId, LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            return false;
        }

        LocalDate startDate = start.toLocalDate();
        LocalDateTime startOfDay = startDate.atTime(0, 0);
        LocalDateTime endOfDay = startDate.atTime(23, 59, 59);

        List<Appointment> appointments = appointmentRepo.findByDoctorIdAndStartingTimeBetween(doctorId, start, end);
        List<Appointment> allDayAppointments = appointmentRepo.findByDoctorIdAndStartingTimeBetween(doctorId, startOfDay,
                endOfDay);

        return appointments.size() == allDayAppointments.size();
    }

    public boolean isAppointmentDuringWorkingHours(Long doctorId, LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null || start.isAfter(end)) {
            return false;
        }

        LocalDate date = start.toLocalDate();
        DayOfWeek dayOfWeek = date.getDayOfWeek();

        WeeklyScheduleTemplate baseTemplate = weeklyRepo.findByDoctorId(doctorId).stream()
                .filter(t -> t.getDayOfWeek() == dayOfWeek)
                .findFirst()
                .orElse(null);

        if (baseTemplate == null || !baseTemplate.isWorking()) {
            return false;
        }

        WorkDayException exception = exceptionRepo.findByDoctorIdAndDate(doctorId, date);

        LocalTime workStart;
        LocalTime workEnd;

        if (exception != null) {
            if (Boolean.FALSE.equals(exception.getWorking())) {
                return false;
            }

            workStart = exception.getOverrideStartTime() != null
                    ? exception.getOverrideStartTime()
                    : baseTemplate.getStartTime();

            workEnd = exception.getOverrideEndTime() != null
                    ? exception.getOverrideEndTime()
                    : baseTemplate.getEndTime();

        } else {
            workStart = baseTemplate.getStartTime();
            workEnd = baseTemplate.getEndTime();
        }

        LocalTime appointmentStart = start.toLocalTime();
        LocalTime appointmentEnd = end.toLocalTime();

        return !appointmentStart.isBefore(workStart) && !appointmentEnd.isAfter(workEnd);
    }

    public List<LocalTime> getAvailableAppointmentTimes(Long doctorId, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();

        WeeklyScheduleTemplate baseTemplate = weeklyRepo.findByDoctorId(doctorId).stream()
                .filter(t -> t.getDayOfWeek() == dayOfWeek)
                .findFirst()
                .orElse(null);

        if (baseTemplate == null || !baseTemplate.isWorking()) {
            return List.of();
        }

        WorkDayException exception = exceptionRepo.findByDoctorIdAndDate(doctorId, date);

        if (exception != null && Boolean.FALSE.equals(exception.getWorking())) {
            return List.of();
        }

        LocalTime workStart = exception != null && exception.getOverrideStartTime() != null
                ? exception.getOverrideStartTime()
                : baseTemplate.getStartTime();

        LocalTime workEnd = exception != null && exception.getOverrideEndTime() != null
                ? exception.getOverrideEndTime()
                : baseTemplate.getEndTime();

        List<Appointment> appointments = appointmentRepo.findByDoctorIdAndStartingTimeBetween(
                doctorId,
                date.atStartOfDay(),
                date.plusDays(1).atStartOfDay()
        );

        List<LocalTime> occupiedSlots = appointments.stream()
                .map(a -> a.getStartingTime().toLocalTime())
                .toList();

        List<LocalTime> availableSlots = new ArrayList<>();

        LocalTime slot = workStart;

        while (!slot.plusMinutes(30).isAfter(workEnd)) {
            if (!occupiedSlots.contains(slot)) {
                availableSlots.add(slot);
            }

            slot = slot.plusMinutes(30);
        }

        return availableSlots;
    }

    public DoctorWorkingTime getDoctorWorkingTime(Long doctorId, LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();

        WeeklyScheduleTemplate baseTemplate = weeklyRepo.findByDoctorId(doctorId).stream()
                .filter(t -> t.getDayOfWeek() == dayOfWeek)
                .findFirst()
                .orElse(null);

        if (baseTemplate == null || !baseTemplate.isWorking()) {
            return null;
        }

        WorkDayException exception = exceptionRepo.findByDoctorIdAndDate(doctorId, date);

        if (exception != null && Boolean.FALSE.equals(exception.getWorking())) {
            return null;
        }

        LocalTime start = exception != null && exception.getOverrideStartTime() != null
                ? exception.getOverrideStartTime()
                : baseTemplate.getStartTime();

        LocalTime end = exception != null && exception.getOverrideEndTime() != null
                ? exception.getOverrideEndTime()
                : baseTemplate.getEndTime();

        return new DoctorWorkingTime(start, end);
    }

}