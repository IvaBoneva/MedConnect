package com.example.server.controller.UserControllers;

import com.example.server.models.Guardian;
import com.example.server.service.GuardianService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/user")
@RestController
public class GuardianController {

    public final GuardianService guardianService;

    public GuardianController(GuardianService guardianService){
        this.guardianService = guardianService;
    }

    @PostMapping("/guardian/register")
    public ResponseEntity<?> createUser(@RequestBody Guardian guardian) {

        try {
            guardianService.saveUser(guardian);
            return new ResponseEntity<>(guardian, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/guardians")
    public List<Guardian> getTestData(){
        return guardianService.getAll();
    }


}
