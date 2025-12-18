package com.example.server.controller.AIDoctorControllers;


import com.example.server.service.AIDoctorServices.AIDoctorService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aiDoctor")
public class AIDoctorController {

    private final AIDoctorService aiDoctorService;

    public AIDoctorController(AIDoctorService aiDoctorService){
        this.aiDoctorService = aiDoctorService;
    }

    @PostMapping("/callGemini")
    public ResponseEntity<?> callGemini(@RequestBody String userInputText) {

        return aiDoctorService.callGeminiDoctor(userInputText);
    }

}
