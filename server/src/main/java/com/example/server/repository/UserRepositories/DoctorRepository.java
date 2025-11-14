package com.example.server.repository.UserRepositories;

import com.example.server.models.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DoctorRepository extends BaseUserRepository<Doctor> {

}
