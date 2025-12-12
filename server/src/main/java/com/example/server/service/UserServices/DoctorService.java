package com.example.server.service.UserServices;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.dto.ExposedUserDTO.DoctorDTO;
import com.example.server.mappers.UserMappers.DoctorMapper;
import com.example.server.models.UserModels.Doctor;
import com.example.server.repository.UserRepositories.DoctorRepository;

@Service
public class DoctorService extends BaseUserServiceImpl<Doctor> {

    private final DoctorMapper doctorMapper;
    private final DoctorRepository doctorRepository;  // Add this specific repository


    public DoctorService(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder, DoctorMapper doctorMapper, DoctorRepository doctorRepository1) {
        super(doctorRepository, passwordEncoder);
        this.doctorMapper = doctorMapper;
        this.doctorRepository = doctorRepository1;
    }

    public List<DoctorDTO> getAllDoctorsDTO(){
        List<Doctor> doctorsList = this.getAll();
        return doctorsList
                .stream()
                .map(doctorMapper::convertToDTO)
                .toList();
    }

    public DoctorDTO getDoctorBySlug(String slug) {
        Optional<Doctor> doctorOpt = doctorRepository.findBySlug(slug);
        return doctorOpt.map(doctorMapper::convertToDTO).orElse(null); // Return null or handle the case if not found
    }

}