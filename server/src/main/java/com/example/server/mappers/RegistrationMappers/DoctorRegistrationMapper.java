package com.example.server.mappers.RegistrationMappers;

import com.example.server.dto.ExposedUserDTO.DoctorRegisterRequestDTO;
import com.example.server.models.RegistrationModels.DoctorRegisterRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DoctorRegistrationMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public DoctorRegistrationMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    // Convert entity (DoctorRegisterRequest) to DTO (DoctorRegisterRequestDTO)
    public DoctorRegisterRequestDTO convertToDTO(DoctorRegisterRequest doctorRegisterRequest) {
        return modelMapper.map(doctorRegisterRequest, DoctorRegisterRequestDTO.class);
    }

    // Convert DTO (DoctorRegisterRequestDTO) to entity (DoctorRegisterRequest)
    public DoctorRegisterRequest convertToEntity(DoctorRegisterRequestDTO doctorRegisterRequestDTO) {
        return modelMapper.map(doctorRegisterRequestDTO, DoctorRegisterRequest.class);
    }
}