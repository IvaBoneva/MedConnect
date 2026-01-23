package com.example.server.dto.GeminiDTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class AIDoctorAgentResponseDTO {
    private String message;
    private FunctionCallDTO function;
}