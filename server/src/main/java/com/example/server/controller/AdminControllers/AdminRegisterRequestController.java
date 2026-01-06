package com.example.server.controller.AdminControllers;

import com.example.server.service.RegistrationServices.DoctorRegistrationService;
import com.example.server.dto.ExposedUserDTO.DoctorRegisterRequestDTO;
import com.example.server.models.RegistrationModels.DoctorRegisterRequest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/admin")
@RestController
public class AdminRegisterRequestController {

    private final DoctorRegistrationService service;

    public AdminRegisterRequestController(DoctorRegistrationService service){
        this.service = service;
    }


    @GetMapping("/doctor")
    public List<DoctorRegisterRequestDTO> getAllRegisterRequests(){
        return service.getPendingRequestsDTO();
    }
    
}