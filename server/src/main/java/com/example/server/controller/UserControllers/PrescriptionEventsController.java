package com.example.server.controller.UserControllers;

import com.example.server.models.PrescriptionEvents;
import com.example.server.repository.PrescriptionEventsRepository;
import com.example.server.service.PrescriptionEventsService;
import com.example.server.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/prescription-events")
public class PrescriptionEventsController {

    private final PrescriptionEventsService prescriptionEventsService;

    public PrescriptionEventsController(PrescriptionEventsService prescriptionEventsService) {
        this.prescriptionEventsService = prescriptionEventsService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PrescriptionEvents>> getPrescriptionEventsByUser(@PathVariable Long userId) {
        List<PrescriptionEvents> events = prescriptionEventsService.getPrescriptionEventsByUser(userId);
        return ResponseEntity.ok(events);
    }

}
