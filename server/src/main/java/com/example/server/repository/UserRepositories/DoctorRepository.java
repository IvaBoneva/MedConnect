package com.example.server.repository.UserRepositories;

import com.example.server.models.UserModels.Doctor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends BaseUserRepository<Doctor> {

        Optional<Doctor> findBySlug(String slug);
}
