package com.example.server.controller.UserControllers;


import com.example.server.models.Patient;
import com.example.server.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/user")
@RestController
public class PatientController {

    public final PatientService patientService;

    public PatientController(PatientService patientService){
        this.patientService = patientService;
    }

    @PostMapping("/patient/register")
    public ResponseEntity<?> createUser(@RequestBody Patient patient) {

        try {
            patientService.saveUser(patient);
            return new ResponseEntity<>(patient, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/patients")
    public List<Patient> getTestData(){
        return patientService.getAll();
    }


}
