package com.example.server.service;

import com.example.server.models.Patient;
import com.example.server.repository.UserRepositories.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PatientService extends BaseUserServiceImpl<Patient> {
    public PatientService(PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        super(patientRepository, passwordEncoder);
    }
}
