package com.example.server.service.AIDoctorServices;

import com.example.server.dto.GeminiDTO.AIDoctorAgentResponseDTO;
import com.example.server.dto.GeminiDTO.FunctionCallDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

public class GeminiParser {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static AIDoctorAgentResponseDTO parse(String rawResponse) {
        try {
            String cleaned = extractJson(rawResponse);

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

    private static String extractJson(String raw) {
        raw = raw.replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```", "");

        int start = raw.indexOf("{");
        int end = raw.lastIndexOf("}");

        if (start == -1 || end == -1 || start > end) {
            throw new IllegalArgumentException("No JSON object found in response");
        }

        return raw.substring(start, end + 1).trim();
    }
}