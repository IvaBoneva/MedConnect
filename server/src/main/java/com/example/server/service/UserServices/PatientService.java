package com.example.server.service.UserServices;

import com.example.server.models.UserModels.Patient;
import com.example.server.repository.UserRepositories.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PatientService extends BaseUserServiceImpl<Patient> {

    private final PatientRepository patientRepository;


    public PatientService(PatientRepository patientRepository, PasswordEncoder passwordEncoder, PatientRepository patientRepository1) {
        super(patientRepository, passwordEncoder);
        this.patientRepository = patientRepository1;
    }

    public Patient findById(Long id) {
        // Using Optional to avoid NullPointerException
        Optional<Patient> patient = patientRepository.findById(id);
        return patient.orElseThrow(() -> new RuntimeException("Patient not found with id " + id));
    }
}
