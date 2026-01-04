package com.example.server.service.RegistrationServices;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.example.server.repository.RegistrationRepositories.DoctorRegistrationRequestRepository;
import com.example.server.models.RegistrationModels.DoctorRegisterRequest;
import com.example.server.repository.UserRepositories.DoctorRepository;

@Service
public class DoctorRegistrationService {

    private final DoctorRegistrationRequestRepository regRequestRepo;
    private final DoctorRepository doctorRepo;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public DoctorRegistrationService(DoctorRegistrationRequestRepository regRequestRepo, DoctorRepository doctorRepo, PasswordEncoder passwordEncoder) {
        this.regRequestRepo = regRequestRepo;
        this.doctorRepo = doctorRepo;
        this.passwordEncoder = passwordEncoder;
    }





}