package com.example.server.service.UserServices;

import com.example.server.dto.ExposedUserDTO.PatientDTO;
import com.example.server.mappers.UserMappers.PatientMapper;
import com.example.server.models.UserModels.Patient;
import com.example.server.repository.StorageRepositories.StorageRepository;
import com.example.server.repository.UserRepositories.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PatientService extends BaseUserServiceImpl<Patient> {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    public PatientService(PatientRepository patientRepository, PasswordEncoder passwordEncoder,
            PatientRepository patientRepository1, PatientMapper patientMapper, StorageRepository storageRepository) {
        super(patientRepository, passwordEncoder, storageRepository);
        this.patientRepository = patientRepository1;
        this.patientMapper = patientMapper;
    }

    public Patient findById(Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        return patient.orElseThrow(() -> new RuntimeException("Patient not found with id " + id));
    }

    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient existingPatient = findById(id);

        if (patientDTO.getPhotoURL() != null) {
            existingPatient.setPhotoURL(patientDTO.getPhotoURL());
        }

        existingPatient.setFirstName(patientDTO.getFirstName());

        existingPatient.setLastName(patientDTO.getLastName());

        existingPatient.setEmail(patientDTO.getEmail());

        existingPatient.setPhoneNumber(patientDTO.getPhoneNumber());

        existingPatient.setAge(patientDTO.getAge());

        existingPatient.setAllergies(patientDTO.getAllergies());

        existingPatient.setDiseases(patientDTO.getDiseases());

        Patient updatedPatient = patientRepository.save(existingPatient);
        return patientMapper.convertToDTO(updatedPatient);
    }
}
