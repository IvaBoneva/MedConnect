package com.example.server.controller.UserControllers;


import com.example.server.dto.ExposedUserDTO.DoctorDTO;
import com.example.server.models.UserModels.Doctor;
import com.example.server.service.UserServices.DoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/user")
@RestController
public class DoctorController{

    public final DoctorService doctorService;

    public DoctorController(DoctorService doctorService){
        this.doctorService = doctorService;
    }

    @PostMapping("/doctor/register")
    public ResponseEntity<?> createUser(@RequestBody Doctor doctor) {

        try {
            doctorService.saveUser(doctor);
            return new ResponseEntity<>(doctor, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

//    @GetMapping("/doctors")
//    public List<Doctor> getTestData(){
//        return doctorService.getAll();
//    }

    @GetMapping("/doctors")
    public List<DoctorDTO> getAllDoctorsDTO(){
        return doctorService.getAllDoctorsDTO();
    }

    @GetMapping("/doctors/{doctorSlug}")
    public DoctorDTO getDoctor(@PathVariable String doctorSlug){
        return doctorService.getDoctorBySlug(doctorSlug);
    }

}
