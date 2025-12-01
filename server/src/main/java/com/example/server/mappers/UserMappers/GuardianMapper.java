package com.example.server.mappers.UserMappers;

import com.example.server.dto.ExposedUserDTO.GuardianDTO;
import com.example.server.models.UserModels.Guardian;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GuardianMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public GuardianMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public GuardianDTO convertToDTO(Guardian guardian){
        return modelMapper.map(guardian,GuardianDTO.class);
    }

    public Guardian convertToEntity(GuardianDTO guardianDTO) {
        return modelMapper.map(guardianDTO, Guardian.class);
    }


}
