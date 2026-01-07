package com.example.server.controller.AdminControllers;

import com.example.server.service.RegistrationServices.DoctorRegistrationService;
import com.example.server.dto.ExposedUserDTO.DoctorRegisterRequestDTO;
import com.example.server.models.RegistrationModels.DoctorRegisterRequest;
import com.example.server.service.UserServices.UserServiceImpl;
import com.example.server.models.UserModels.User;
import com.example.server.config.JwtGeneratorInterface;

import java.util.List;
import java.util.ArrayList;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/admin")
@RestController
public class AdminRegisterRequestController {

    private final DoctorRegistrationService service;
    private final JwtGeneratorInterface jwtGeneratorInterface;
    private final UserServiceImpl baseUserService;
    private final PasswordEncoder passwordEncoder;

    public AdminRegisterRequestController(DoctorRegistrationService service, UserServiceImpl baseUserService, 
    PasswordEncoder passwordEncoder, JwtGeneratorInterface jwtGeneratorInterface){
        this.service = service;
        this.baseUserService = baseUserService;
        this.passwordEncoder = passwordEncoder;
        this.jwtGeneratorInterface = jwtGeneratorInterface;
    }

    
   @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody User user) {

        try {
            if (user.getEmail() == null || user.getPassword() == null) {
                throw new UsernameNotFoundException("UserName or Password is Empty");
            }
            User userData = baseUserService.getUserByEmail(user.getEmail());
            if (userData == null) {
                throw new UsernameNotFoundException("User with this username not registered");
            }
            if (!passwordEncoder.matches(user.getPassword(), userData.getPassword())) {
                throw new UsernameNotFoundException("Wrong PASSWORD");
            }
            return new ResponseEntity<>(jwtGeneratorInterface.generateToken(userData), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/doctor_register_requests")
    public List<DoctorRegisterRequestDTO> getAllRegisterRequests(){
        return service.getPendingRequestsDTO();
    }


}

    
