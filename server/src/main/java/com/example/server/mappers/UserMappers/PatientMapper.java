package com.example.server.mappers.UserMappers;

import com.example.server.dto.ExposedUserDTO.PatientDTO;
import com.example.server.models.UserModels.Patient;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PatientMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public PatientMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public PatientDTO convertToDTO(Patient patient) {
        PatientDTO dto = modelMapper.map(patient, PatientDTO.class);

        if (patient.getAllergies() != null) {
            dto.setAllergies(patient.getAllergies());
        }
        if (patient.getDiseases() != null) {
            dto.setDiseases(patient.getDiseases());
        }

        return dto;
    }

    public Patient convertToEntity(PatientDTO patientDTO) {
        return modelMapper.map(patientDTO, Patient.class);
    }

}
