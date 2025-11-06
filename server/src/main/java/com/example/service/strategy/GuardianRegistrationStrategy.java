package com.example.service.strategy;

import com.example.dto.UserDTO;
import com.example.model.UserEntity;
import com.example.enums.UserRole;

public class GuardianRegistrationStrategy implements RoleRegistrationStrategy {
    @Override
    public void processRegistration(UserDTO userDTO, UserEntity userEntity) {
        userEntity.setKidFirstName(userDTO.getKidFirstName());
        userEntity.setKidLastName(userDTO.getKidLastName());
        userEntity.setKidAge(userDTO.getKidAge());
        userEntity.setHasDisability(userDTO.getHasDisability() != null ? userDTO.getHasDisability() : false);
        userEntity.setDisabilityDesc(userDTO.getDisabilityDesc());
    }

    @Override
    public UserRole getRole() {
        return UserRole.ROLE_GUARDIAN;
    }
}
