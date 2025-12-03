package com.example.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.server.models.Prescription;
import com.example.server.models.UserModels.User;
import com.example.server.repository.PrescriptionRepository;
import com.example.server.repository.UserRepositories.UserRepository;

@Service
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository, UserRepository userRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
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

}