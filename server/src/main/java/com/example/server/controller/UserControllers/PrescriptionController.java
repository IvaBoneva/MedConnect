package com.example.server.controller.UserControllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.example.server.models.PrescriptionEvents;
import com.example.server.service.PrescriptionEventsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.PrescriptionDTO;
import com.example.server.dto.PrescriptionPatchDTO;
import com.example.server.mappers.PrescriptionMapper;
import com.example.server.models.Prescription;
import com.example.server.service.PrescriptionService;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final PrescriptionMapper prescriptionMapper;
    private final PrescriptionEventsService prescriptionEventsService;

    public PrescriptionController(PrescriptionService prescriptionService, PrescriptionMapper prescriptionMapper, PrescriptionEventsService prescriptionEventsService) {
        this.prescriptionService = prescriptionService;
        this.prescriptionMapper = prescriptionMapper;
        this.prescriptionEventsService = prescriptionEventsService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<PrescriptionDTO> createPrescription(@PathVariable Long userId,
                                                              @RequestBody Prescription prescription) {

        Prescription prescriptionSave = prescriptionService.addPrescription(userId, prescription);

        List<PrescriptionEvents> prescriptionEvents = generatePrescriptionEvents(prescriptionSave);

        prescriptionEventsService.saveAll(prescriptionEvents);

        PrescriptionDTO prescriptionDTO = prescriptionMapper.convertToDTO(prescriptionSave);

        return ResponseEntity.ok(prescriptionDTO);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByUserId(@PathVariable Long userId) {

        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByUserId(userId);

        List<PrescriptionDTO> dtoList = prescriptions.stream()
                .map(prescriptionMapper::convertToDTO)
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PrescriptionDTO> updatePrescription(@PathVariable Long id,
                                                              @RequestBody PrescriptionPatchDTO prescription) {

        PrescriptionDTO updated = prescriptionService.updatePrescription(id, prescription);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescription(@PathVariable Long id) {

        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok("Prescription deleted successfully");
    }

    private List<PrescriptionEvents> generatePrescriptionEvents(Prescription prescription) {
        List<PrescriptionEvents> prescriptionEvents = new ArrayList<>();
        LocalDate startDate = prescription.getStartDate();
        LocalDate endDate = prescription.getEndDate();
        String takingHours = prescription.getTakingHour(); // Taking hours in the format "HH:mm, HH:mm"

        // Split takingHour string into individual times (if multiple)
        String[] times = takingHours.split(",\\s*");

        // Loop through each day from startDate to endDate
        for (LocalDate currentDate = startDate; !currentDate.isAfter(endDate); currentDate = currentDate.plusDays(1)) {

            for (String time : times) {
                // Parse each taking hour into LocalTime (i.e., HH:mm)
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
                LocalTime parsedTakingHour = LocalTime.parse(time, timeFormatter);

                LocalDateTime startDateTime = currentDate.atTime(parsedTakingHour);
                LocalDateTime endDateTime = currentDate.atTime(LocalTime.MAX);

                PrescriptionEvents event = new PrescriptionEvents();
                event.setTitle("Prescription: " + prescription.getMedicationName());
                event.setStartDateTime(startDateTime);
                event.setEndDateTime(endDateTime);
                event.setTakingHours(startDateTime.toLocalTime().toString());
                event.setUser(prescription.getUser());

                prescriptionEvents.add(event);
            }
        }

        return prescriptionEvents;
    }
}