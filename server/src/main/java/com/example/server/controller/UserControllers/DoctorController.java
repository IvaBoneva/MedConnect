package com.example.server.controller.UserControllers;

import java.util.List;

import javax.print.Doc;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.ExposedUserDTO.DoctorDTO;
import com.example.server.dto.ExposedUserDTO.GuardianDTO;
import com.example.server.mappers.UserMappers.DoctorMapper;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Guardian;
import com.example.server.service.UserServices.DoctorService;

@RequestMapping("/api/user")
@RestController
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorMapper doctorMapper;

    public DoctorController(DoctorService doctorService, DoctorMapper doctorMapper) {
        this.doctorService = doctorService;
        this.doctorMapper = doctorMapper;
    }

    @PostMapping("/doctor/register")
    public ResponseEntity<?> createUser(@RequestBody Doctor doctor) {

        try {
            doctorService.saveUser(doctor);
            doctorService.createDefaultWeeklyScheduleForDoctor(doctor);
            return new ResponseEntity<>(doctor, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/doctors")
    public List<DoctorDTO> getAllDoctorsDTO() {
        return doctorService.getAllDoctorsDTO();
    }

    @GetMapping("/doctors/{doctorSlug}")
    public DoctorDTO getDoctor(@PathVariable String doctorSlug) {
        return doctorService.getDoctorBySlug(doctorSlug);
    }

    @GetMapping("/doctor/{id}")
    public ResponseEntity<DoctorDTO> getDoctorWithAppointments(@PathVariable Long id) {

        Doctor doctor = doctorService.findById(id);

        DoctorDTO doctorDTO = doctorMapper.convertToDTO(doctor);

        return ResponseEntity.ok(doctorDTO);
    }

    @PutMapping("/doctor/update/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        {

            DoctorDTO updatedDoctorDTO = doctorService.updateDoctor(id, doctorDTO);

            return ResponseEntity.ok(updatedDoctorDTO);
        }

    }
}
