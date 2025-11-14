package com.example.server.service.UserService;

import com.example.server.models.Patient;
import com.example.server.repository.UserRepositories.PatientRepository;
import com.example.server.service.UserService.BaseUserServiceImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PatientService extends BaseUserServiceImpl<Patient> {
    public PatientService(PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        super(patientRepository, passwordEncoder);
    }
}
