package com.example.server.controller.AIDoctorControllers;


import com.example.server.dto.GeminiDTO.AIChatRequestDTO;
import com.example.server.dto.GeminiDTO.ChatMessageDTO;
import com.example.server.service.AIDoctorServices.AIDoctorOrchestratorService;
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
    private final AIDoctorOrchestratorService orchestrator;

    @PostMapping("/callGemini")
    public ResponseEntity<ChatMessageDTO> callGemini(
            @RequestBody AIChatRequestDTO dto
    ) {
        System.out.println(" ORCHESTRATOR HIT ");

        ChatMessageDTO response =
                orchestrator.handleUserMessage(
                        dto.getConversationId(),
                        dto.getUserInputText()
                );

        return ResponseEntity.ok(response);
    }

}
