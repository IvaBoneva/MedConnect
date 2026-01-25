package com.example.server.service.AIDoctorServices;

import com.example.server.dto.GeminiDTO.AIDoctorAgentResponseDTO;
import com.example.server.dto.GeminiDTO.FunctionCallDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

public class GeminiParser {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static AIDoctorAgentResponseDTO parse(String rawResponse) {
        try {
            String cleaned = rawResponse
                    .replaceAll("(?s)```json\\s*", "")
                    .replaceAll("(?s)```", "")
                    .trim();

            Map<String, Object> map = objectMapper.readValue(cleaned, Map.class);

            AIDoctorAgentResponseDTO dto = new AIDoctorAgentResponseDTO();
            dto.setMessage((String) map.getOrDefault("message", ""));

            Map<String, Object> functionMap = (Map<String, Object>) map.get("function");
            if (functionMap != null && functionMap.get("name") != null) {
                FunctionCallDTO function = new FunctionCallDTO();
                function.setName((String) functionMap.get("name"));

                Map<String, Object> args = (Map<String, Object>) functionMap.getOrDefault("arguments", Map.of());
                function.setArguments(args);

                dto.setFunction(function);
            }

            return dto;
        } catch (Exception e) {
            AIDoctorAgentResponseDTO dto = new AIDoctorAgentResponseDTO();
            dto.setMessage(rawResponse);
            return dto;
        }
    }
}