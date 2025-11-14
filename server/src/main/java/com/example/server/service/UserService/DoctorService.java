package com.example.server.service.UserService;

import com.example.server.models.Doctor;
import com.example.server.repository.UserRepositories.DoctorRepository;
import com.example.server.service.UserService.BaseUserServiceImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DoctorService extends BaseUserServiceImpl<Doctor> {

    public DoctorService(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        super(doctorRepository, passwordEncoder);
    }

    // You can add doctor-specific methods here if needed
}