package com.example.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.server.dto.PrescriptionDTO;
import com.example.server.dto.PrescriptionPatchDTO;
import com.example.server.mappers.PrescriptionMapper;
import com.example.server.models.Prescription;
import com.example.server.models.UserModels.User;
import com.example.server.repository.PrescriptionRepository;
import com.example.server.repository.UserRepositories.UserRepository;

@Service
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final PrescriptionMapper prescriptionMapper;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, UserRepository userRepository,
            PrescriptionMapper prescriptionMapper) {
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
        this.prescriptionMapper = prescriptionMapper;
    }

    public Prescription addPrescription(Long userId, Prescription prescription) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }

        prescription.setUser(userOpt.get());

        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getPrescriptionsByUserId(Long userId) {
        return prescriptionRepository.findByUserId(userId);
    }

    public PrescriptionDTO updatePrescription(Long id, PrescriptionPatchDTO patch) {

        Prescription existing = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (patch.getMedicationName() != null)
            existing.setMedicationName(patch.getMedicationName());

        if (patch.getDosage() != null)
            existing.setDosage(patch.getDosage());

        if (patch.getStartDate() != null)
            existing.setStartDate(patch.getStartDate());

        if (patch.getEndDate() != null)
            existing.setEndDate(patch.getEndDate());

        if (patch.getPrescribingDoctor() != null)
            existing.setPrescribingDoctor(patch.getPrescribingDoctor());

        if (patch.getTakingHour() != null)
            existing.setTakingHour(patch.getTakingHour());

        Prescription saved = prescriptionRepository.save(existing);

        return prescriptionMapper.convertToDTO(saved);
    }

    public void deletePrescription(Long id) {

        prescriptionRepository.deleteById(id);
    }
}