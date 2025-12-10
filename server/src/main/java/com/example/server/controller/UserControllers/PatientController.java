package com.example.server.controller.UserControllers;

import com.example.server.dto.ExposedUserDTO.PatientDTO;
import com.example.server.mappers.ModelMapperConfig;
//import com.example.server.dto.ExposedUserDTO.PatientWithAppointmentsDTO;
import com.example.server.mappers.UserMappers.PatientMapper;
//import com.example.server.mappers.PatientWithAppointmentsMapper;
import com.example.server.models.UserModels.Patient;
import com.example.server.models.UserModels.User;
import com.example.server.service.UserServices.PatientService;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequestMapping("/api/user/patient")
@RestController
public class PatientController {

//    private final PatientWithAppointmentsMapper patientWithAppointmentsMapper;
    private final PatientMapper patientMapper;
    private final PatientService patientService;
    private final ModelMapperConfig modelMapperConfig;

    public PatientController(
//            PatientWithAppointmentsMapper patientWithAppointmentsMapper,
            PatientMapper patientMapper, PatientService patientService, ModelMapperConfig modelMapperConfig) {
//        this.patientWithAppointmentsMapper = patientWithAppointmentsMapper;
        this.patientMapper = patientMapper;
        this.patientService = patientService;
        this.modelMapperConfig = modelMapperConfig;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody Patient patient) {

        try {
            patientService.saveUser(patient);
            return new ResponseEntity<>(patient, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/subscription")
    public ResponseEntity<?> getUserSubscription(@RequestParam String email) {
        User user = patientService.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        Map<String, String> response = new HashMap<>();

        response.put("subscriptionStatus", user.getSubscription());
        response.put("subscriptionType", user.getSubscriptionType());
        response.put("subscriptionExpiry", user.getSubscriptionExpiry().toString());

        return ResponseEntity.ok(response);

    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatientWithAppointments(@PathVariable Long id) {
        // Fetch the patient from the service
        Patient patient = patientService.findById(id);

        // Map the patient entity to PatientWithAppointmentsDTO
        PatientDTO patientDTO = patientMapper.convertToDTO(patient);

        // Return the mapped DTO in the response
        return ResponseEntity.ok(patientDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PatientDTO> updatePatient(@PathVariable Long id, @RequestBody PatientDTO patientDTO) {
        
        PatientDTO updatedPatientDTO = patientService.updatePatient(id, patientDTO);
        return ResponseEntity.ok(updatedPatientDTO);
    }

}
