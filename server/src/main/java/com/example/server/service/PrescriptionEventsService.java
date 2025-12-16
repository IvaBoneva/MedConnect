package com.example.server.service;

import com.example.server.models.PrescriptionEvents;
import com.example.server.repository.PrescriptionEventsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionEventsService {

    private final PrescriptionEventsRepository prescriptionEventsRepository;

    public PrescriptionEventsService(PrescriptionEventsRepository prescriptionEventsRepository){
        this.prescriptionEventsRepository = prescriptionEventsRepository;
    }

    // Method to save all PrescriptionEvents
    public List<PrescriptionEvents> saveAll(List<PrescriptionEvents> events) {
        return prescriptionEventsRepository.saveAll(events); // Save all PrescriptionEvents at once
    }

    public List<PrescriptionEvents> getPrescriptionEventsByUser(Long userId) {
        return prescriptionEventsRepository.findByUserId(userId);
    }
}
