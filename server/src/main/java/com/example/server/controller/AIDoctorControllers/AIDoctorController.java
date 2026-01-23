package com.example.server.controller.AIDoctorControllers;


import com.example.server.dto.GeminiDTO.AIDoctorRequestDTO;
import com.example.server.service.AIDoctorServices.AIDoctorAgentService;
import com.example.server.service.AIDoctorServices.AIDoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aiDoctor")
@RequiredArgsConstructor
public class AIDoctorController {

    private final AIDoctorService aiDoctorService;
    private final AIDoctorAgentService aiDoctorAgentService;

//    @PostMapping("/callGemini")
//    public ResponseEntity<?> callGemini(@RequestBody String userInputText) {
//
//        return aiDoctorService.callGeminiDoctor(userInputText);
//    }

    @PostMapping("/callGemini")
    public ResponseEntity<?> callGemini(@RequestBody AIDoctorRequestDTO requestDTO) {
        return aiDoctorAgentService.handleUserMessage(requestDTO);
    }

}
