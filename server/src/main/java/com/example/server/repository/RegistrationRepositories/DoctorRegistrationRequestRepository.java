package com.example.server.repository.RegistrationRepositories;

import com.example.server.models.RegistrationModels.DoctorRegisterRequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DoctorRegistrationRequestRepository<T> extends JpaRepository<DoctorRegisterRequest, Long>{
    Optional<DoctorRegisterRequest> findByEmail(String email);
    boolean existsByEmailAndStatus(String email, DoctorRegisterRequest.Status status);

}