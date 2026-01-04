package com.example.server.controller.RegistrationControllers;

import com.example.server.service.RegistrationServices.DoctorRegistrationService;
import com.example.server.models.RegistrationModels.DoctorRegisterRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

public class DoctorRegistrationController {
    private final DoctorRegistrationService service;

    public DoctorRegistrationController(DoctorRegistrationService service){
        this.service = service;
    }

    @PostMapping("/doctor/register")
    public ResponseEntity<?> create(@RequestBody DoctorRegisterRequest dto){

        return null;
    }

}