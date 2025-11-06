package com.example.service.strategy;

import org.springframework.stereotype.Component;

import com.example.dto.UserDTO;
import com.example.enums.UserRole;
import com.example.model.UserEntity;

@Component
public class DoctorRegistrationStrategy implements RoleRegistrationStrategy {

    @Override
    public void processRegistration(UserDTO userDTO, UserEntity userEntity) {
        userEntity.setSpecialization(userDTO.getSpecialization());
    }

    @Override
    public UserRole getRole() {
        return UserRole.ROLE_DOCTOR;
    }
}
