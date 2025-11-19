package com.example.server.mappers;


import com.example.server.dto.ExposedUserDTO.DoctorDTO;
import com.example.server.dto.ExposedUserDTO.UserDTO;
import com.example.server.models.Doctor;
import com.example.server.models.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DoctorMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public DoctorMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public DoctorDTO convertToDTO(Doctor doctor){
        return modelMapper.map(doctor,DoctorDTO.class);
    }

    public Doctor convertToEntity(DoctorDTO doctorDTO) {
        return modelMapper.map(doctorDTO, Doctor.class);
    }

}
