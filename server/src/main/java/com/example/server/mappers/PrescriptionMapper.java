package com.example.server.mappers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.server.dto.PrescriptionDTO;
import com.example.server.models.Prescription;

@Component
public class PrescriptionMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public PrescriptionMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;

        // Custom mapping for userId
        modelMapper.typeMap(Prescription.class, PrescriptionDTO.class)
                .addMapping(src -> src.getUser().getId(), PrescriptionDTO::setUserId);
    }

    public PrescriptionDTO convertToDTO(Prescription prescription) {
        return modelMapper.map(prescription, PrescriptionDTO.class);
    }

    public Prescription convertToEntity(PrescriptionDTO prescriptionDTO) {
        return modelMapper.map(prescriptionDTO, Prescription.class);
    }
}
