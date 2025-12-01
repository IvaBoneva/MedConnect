package com.example.server.controller.UserControllers;

import com.example.server.models.UserModels.Guardian;
import com.example.server.models.UserModels.User;
import com.example.server.service.UserServices.GuardianService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/user/guardian")
@RestController
public class GuardianController {

    public final GuardianService guardianService;

    public GuardianController(GuardianService guardianService) {
        this.guardianService = guardianService;
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

        String subscriptionStatus = user.getSubscription();

        return ResponseEntity.ok(Map.of("subscriptionStatus", subscriptionStatus));

    }

}
