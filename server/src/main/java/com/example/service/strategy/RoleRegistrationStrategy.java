package com.example.util;

import com.example.model.UserEntity;
import com.example.dto.UserDTO;

public interface RoleRegistrationStrategy {
    void processRegistration(UserDTO userDTO, UserEntity userEntity);
}