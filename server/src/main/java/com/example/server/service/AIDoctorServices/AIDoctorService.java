package com.example.server.service.AIDoctorServices;

import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.server.dto.GeminiDTO.AIDoctorResponseDTO;
import com.example.server.dto.GeminiDTO.ContentDTO;
import com.example.server.dto.GeminiDTO.GeminiRequestDTO;
import com.example.server.dto.GeminiDTO.GeminiResponseDTO;
import com.example.server.dto.GeminiDTO.PartDTO;
import com.example.server.dto.GeminiDTO.SystemInstructionsDTO;

@Service
public class AIDoctorService {
    @Value("${gemini.token}")
        private  String googleCloudToken;
        private final String geminiUrl = "https://aiplatform.googleapis.com/v1/projects/gen-lang-client-0975020993/locations/us-central1/publishers/google/models/gemini-2.0-flash-001:generateContent";

    public ResponseEntity<AIDoctorResponseDTO> callGeminiDoctor(String userInputText) {
        try {
            GeminiRequestDTO requestBody = buildRequestBody(userInputText);
            HttpEntity<GeminiRequestDTO> entity = buildHttpEntity(requestBody);
            ResponseEntity<GeminiResponseDTO> response = callGeminiApi(entity);
            return ResponseEntity.ok(mapToAIDoctorResponse(response));
        } catch (Exception e) {
            e.printStackTrace(); // ⬅️ ЗАДЪЛЖИТЕЛНО
            throw e;
        }
    }

        // ---------------- HELPERS ---------------- //

        private GeminiRequestDTO buildRequestBody(String userInputText) {

                PartDTO systemPart = new PartDTO();

            systemPart.setText("""
You are a medical assistant agent.
Always respond in valid JSON.
Use only these actions:
NONE, SUGGEST_DOCTORS, SHOW_CALENDAR, CREATE_APPOINTMENT

Response format:
{
  "message": "...",
  "action": "NONE",
  "data": {}
}
Never return text outside JSON.
When creating an appointment:
- doctorId must be a number
- date must be ISO format yyyy-MM-dd
- time must be HH:mm
If information is missing, ask the user.

""");

                SystemInstructionsDTO systemInstruction = new SystemInstructionsDTO();
                systemInstruction.setParts(List.of(systemPart));

                PartDTO userPart = new PartDTO();
                userPart.setText(userInputText);

                ContentDTO userContent = new ContentDTO();
                userContent.setRole("user");
                userContent.setParts(List.of(userPart));

                GeminiRequestDTO request = new GeminiRequestDTO();
                request.setSystemInstruction(systemInstruction);
                request.setContents(List.of(userContent));

            request.setGenerationConfig(
                    Map.of("responseMimeType", "application/json")
            );

                return request;
        }

        private HttpEntity<GeminiRequestDTO> buildHttpEntity(GeminiRequestDTO body) {

                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(googleCloudToken);
                headers.setContentType(MediaType.APPLICATION_JSON);

                return new HttpEntity<>(body, headers);
        }

        private ResponseEntity<GeminiResponseDTO> callGeminiApi(
                        HttpEntity<GeminiRequestDTO> entity) {

                RestTemplate restTemplate = new RestTemplate();
                return restTemplate.exchange(
                                geminiUrl,
                                HttpMethod.POST,
                                entity,
                                GeminiResponseDTO.class);
        }

        private AIDoctorResponseDTO mapToAIDoctorResponse(
                        ResponseEntity<GeminiResponseDTO> response) {

                String answer = response.getBody()
                                .getCandidates()
                                .get(0)
                                .getContent()
                                .getParts()
                                .get(0)
                                .getText();

                String date = response.getHeaders().getFirst(HttpHeaders.DATE);

                AIDoctorResponseDTO dto = new AIDoctorResponseDTO();
                dto.setAnswer(answer);
                dto.setDate(date);

                return dto;
        }

}
