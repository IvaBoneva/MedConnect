package com.example.server.controller.UserControllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.PrescriptionDTO;
import com.example.server.mappers.PrescriptionMapper;
import com.example.server.models.Prescription;
import com.example.server.service.PrescriptionService;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final PrescriptionMapper prescriptionMapper;

    public PrescriptionController(PrescriptionService prescriptionService, PrescriptionMapper prescriptionMapper) {
        this.prescriptionService = prescriptionService;
        this.prescriptionMapper = prescriptionMapper;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<PrescriptionDTO> createPrescription(@PathVariable Long userId,
            @RequestBody Prescription prescription) {

        Prescription prescriptionSave = prescriptionService.addPrescription(userId, prescription);
        PrescriptionDTO prescriptionDTO = prescriptionMapper.convertToDTO(prescriptionSave);

        return ResponseEntity.ok(prescriptionDTO);
    }

    @GetMapping("/user/{userId}")
public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByUserId(@PathVariable Long userId) {

    List<Prescription> prescriptions = prescriptionService.getPrescriptionsByUserId(userId);

    List<PrescriptionDTO> dtoList = prescriptions.stream()
            .map(prescriptionMapper::convertToDTO)
            .toList();

    return ResponseEntity.ok(dtoList);
}


}