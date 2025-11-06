package com.example.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.example.enums.UserRole;
import com.example.repository.UserRepository;
import com.example.service.strategy.RoleRegistrationStrategy;

import org.springframework.stereotype.Service;
import com.example.dto.UserDTO;
import com.example.model.UserEntity;
import com.example.util.PasswordValidator;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final List<RoleRegistrationStrategy> roleStrategiesList;
    private final Map<UserRole, RoleRegistrationStrategy> roleStrategies = new HashMap<>();

    @PostConstruct
    public void init() {
        for (RoleRegistrationStrategy strategy : roleStrategiesList) {
            roleStrategies.put(strategy.getRole(), strategy);
        }
    }

    @Transactional
    public void registerUser(UserDTO userDTO) {

        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Имейлът вече е регистриран.");
        }

        if (!PasswordValidator.isValid(userDTO.getPassword())) {
            throw new IllegalArgumentException(PasswordValidator.getRequirements());
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setFirstName(userDTO.getFirstName());
        userEntity.setLastName(userDTO.getLastName());
        userEntity.setAge(userDTO.getAge());
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setPhoneNumber(userDTO.getPhoneNumber());
        userEntity.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        RoleRegistrationStrategy strategy = roleStrategies.get(userDTO.getRole());

        if (strategy != null) {
            strategy.processRegistration(userDTO, userEntity);
        }

        userRepository.save(userEntity);
    }
}
