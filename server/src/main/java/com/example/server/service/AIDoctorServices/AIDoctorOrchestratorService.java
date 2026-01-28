package com.example.server.service.AIDoctorServices;

import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.dto.GeminiDTO.AIActionResponseDTO;
import com.example.server.dto.GeminiDTO.ChatMessageDTO;
import com.example.server.service.CalendarServices.AppointmentService;
import com.example.server.service.CalendarServices.CalendarService;
import com.example.server.service.UserServices.DoctorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AIDoctorOrchestratorService {
    private final AIDoctorService aiDoctorService;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final CalendarService calendarService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, ConversationContext> conversations = new ConcurrentHashMap<>();


    public ChatMessageDTO handleUserMessage(String conversationId, String message) {
        ConversationContext context = conversations.computeIfAbsent(
                conversationId, id -> new ConversationContext()
        );

        String aiRawResponse = aiDoctorService.callGeminiDoctor(message)
                .getBody()
                .getAnswer();

        AIActionResponseDTO aiResponse = parseAIResponse(aiRawResponse);

        ChatMessageDTO chatMessage = new ChatMessageDTO();
        chatMessage.setRole("ai");
        chatMessage.setText(aiResponse.getMessage());
        chatMessage.setData(aiResponse.getData());

        switch (aiResponse.getAction()) {
            case SUGGEST_DOCTORS:
                chatMessage.setText(
                        aiResponse.getMessage() != null
                                ? aiResponse.getMessage()
                                : "Ето подходящи лекари:"
                );
                chatMessage.setData(
                        doctorService.getDoctorsBySpecialization(
                                (String) aiResponse.getData().get("specialty")
                        )
                );
                break;

            case CREATE_APPOINTMENT:
                AppointmentCreateDTO dto =
                        buildAppointmentDTO(aiResponse.getData(), context);

                chatMessage.setText(
                        aiResponse.getMessage() != null
                                ? aiResponse.getMessage()
                                : "Вашият час е запазен успешно."
                );
                chatMessage.setData(appointmentService.createAppointment(dto));
                break;

            default:
                chatMessage.setText(
                        aiResponse.getMessage() != null && !aiResponse.getMessage().isBlank()
                                ? aiResponse.getMessage()
                                : "Може ли малко повече информация?"
                );
        }

        return chatMessage;
    }



    private AIActionResponseDTO parseAIResponse(String raw) {
        try {
            String cleaned = raw
                    .replaceAll("(?s)```json", "")
                    .replaceAll("```", "")
                    .trim();

            return objectMapper.readValue(cleaned, AIActionResponseDTO.class);

        } catch (Exception e) {
            AIActionResponseDTO fallback = new AIActionResponseDTO();
            fallback.setAction(Action.NONE);
            fallback.setMessage(raw); // показвай суровия текст
            return fallback;
        }
    }


    private AppointmentCreateDTO buildAppointmentDTO(
            Map<String, Object> data,
            ConversationContext context
    ) {

        AppointmentCreateDTO dto = new AppointmentCreateDTO();

        dto.setDoctorId(Long.valueOf(data.get("doctorId").toString()));
        dto.setPatientId(context.getPatientId()); // идва от auth / frontend
        dto.setDate(LocalDate.parse(data.get("date").toString()));
        dto.setStart(LocalTime.parse(data.get("time").toString()));
        dto.setComment("Created by AI assistant");

        return dto;
    }
}
