package com.example.server.service.UserServices;

import com.example.server.dto.ExposedUserDTO.GuardianDTO;
import com.example.server.mappers.UserMappers.GuardianMapper;
import com.example.server.models.UserModels.Guardian;
import com.example.server.repository.StorageRepositories.StorageRepository;
import com.example.server.repository.UserRepositories.GuardianRepository;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class GuardianService extends BaseUserServiceImpl<Guardian> {

    private final GuardianRepository guardianRepository;
    private final GuardianMapper guardianMapper;

    public GuardianService(GuardianRepository guardianRepository, PasswordEncoder passwordEncoder,
            GuardianRepository guardianRepository1, GuardianMapper guardianMapper,
            StorageRepository storageRepository) {
        super(guardianRepository, passwordEncoder, storageRepository);
        this.guardianRepository = guardianRepository1;
        this.guardianMapper = guardianMapper;
    }

    public Guardian findById(Long id) {
        Optional<Guardian> guardian = guardianRepository.findById(id);
        return guardian.orElseThrow(() -> new RuntimeException("Guardian not found with id " + id));
    }

    public GuardianDTO updateGuardian(Long id, GuardianDTO guardianDTO) {
        Guardian existingGuardian = findById(id);

        if (guardianDTO.getPhotoURL() != null) {
            existingGuardian.setPhotoURL(guardianDTO.getPhotoURL());
        }

        existingGuardian.setWardFirstName(guardianDTO.getWardFirstName());
        existingGuardian.setWardLastName(guardianDTO.getWardLastName());
        existingGuardian.setWardAge(guardianDTO.getWardAge());
        existingGuardian.setWardDisabilityDescription(guardianDTO.getWardDisabilityDescription());
        existingGuardian.setWardAllergies(guardianDTO.getWardAllergies());
        existingGuardian.setWardDiseases(guardianDTO.getWardDiseases());

        existingGuardian.setFirstName(guardianDTO.getFirstName());
        existingGuardian.setLastName(guardianDTO.getLastName());
        existingGuardian.setAge(guardianDTO.getAge());
        existingGuardian.setEmail(guardianDTO.getEmail());
        existingGuardian.setPhoneNumber(guardianDTO.getPhoneNumber());

        Guardian updatedGuardian = guardianRepository.save(existingGuardian);
        return guardianMapper.convertToDTO(updatedGuardian);

    }

}