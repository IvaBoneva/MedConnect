package com.example.server.controller.UserControllers;

import com.example.server.dto.ExposedUserDTO.GuardianDTO;
import com.example.server.dto.ExposedUserDTO.PatientDTO;
import com.example.server.mappers.UserMappers.GuardianMapper;
import com.example.server.models.UserModels.Guardian;
import com.example.server.models.UserModels.Patient;
import com.example.server.models.UserModels.User;
import com.example.server.service.UserServices.GuardianService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/api/user/guardian")
@RestController
public class GuardianController {

    private final GuardianService guardianService;
    private final GuardianMapper guardianMapper;

    public GuardianController(GuardianService guardianService, GuardianMapper guardianMapper) {
        this.guardianService = guardianService;
        this.guardianMapper = guardianMapper;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody Guardian guardian) {

        try {
            guardianService.saveUser(guardian);
            return new ResponseEntity<>(guardian, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/guardians")
    public List<Guardian> getTestData() {
        return guardianService.getAll();
    }

    @GetMapping("/subscription")
    public ResponseEntity<?> getUserSubscription(@RequestParam String email) {
        User user = guardianService.getUserByEmail(email);

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
    public ResponseEntity<GuardianDTO> getGuardianWithAppointments(@PathVariable Long id) {

        Guardian guardian = guardianService.findById(id);

        GuardianDTO guardianDTO = guardianMapper.convertToDTO(guardian);

        return ResponseEntity.ok(guardianDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<GuardianDTO> updateGuardian(@PathVariable Long id, @RequestBody GuardianDTO guardianDTO) {

        GuardianDTO updatedGuardianDTO = guardianService.updateGuardian(id, guardianDTO);

        return ResponseEntity.ok(updatedGuardianDTO);
    }

}
