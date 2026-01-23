package com.example.server.service.AIDoctorServices;

import com.example.server.dto.ExposedUserDTO.DoctorDTO;
import com.example.server.dto.GeminiDTO.ContentDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ConversationStore {
    private final Map<String, List<ContentDTO>> conversations = new HashMap<>();
    private final Map<String, List<DoctorDTO>> doctorsPerSession = new HashMap<>();

    public List<ContentDTO> getConversation(String sessionId) {
        return conversations.computeIfAbsent(sessionId, k -> new ArrayList<>());
    }

    public void addMessage(String sessionId, ContentDTO content) {
        getConversation(sessionId).add(content);
    }

    public void addDoctorsList(String sessionId, List<DoctorDTO> doctors) {
        doctorsPerSession.put(sessionId, doctors);
    }

    public List<DoctorDTO> getDoctorsList(String sessionId) {
        return doctorsPerSession.getOrDefault(sessionId, new ArrayList<>());
    }
}