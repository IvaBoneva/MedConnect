package com.example.server.controller.CalendarControllers;

import com.example.server.dto.CalendarDTO.CalendarDayDTO;
import com.example.server.dto.CalendarDTO.WorkDayExceptionDTO;
import com.example.server.service.CalendarServices.CalendarService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<CalendarDayDTO>> getDoctorCalendar(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {

        List<CalendarDayDTO> calendar = calendarService.getDoctorCalendar(doctorId, from, to);
        return ResponseEntity.ok(calendar);
    }


    @PatchMapping("/doctor/off")
    public ResponseEntity<?> setDayOff(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        try {
            calendarService.setDayOff(doctorId, date);
            return ResponseEntity.ok("The day off for the doctor has been successfully updated.");
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PatchMapping("/doctor/{doctorId}/exception")
    public ResponseEntity<?> createWorkDayException(
            @PathVariable Long doctorId,
            @RequestBody WorkDayExceptionDTO workDayExceptionDTO
    ) {
        try {
            calendarService.updateWorkDayException(doctorId, workDayExceptionDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }

    }
}
