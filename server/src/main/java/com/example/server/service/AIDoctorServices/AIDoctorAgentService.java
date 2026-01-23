package com.example.server.service.AIDoctorServices;

import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.dto.ExposedUserDTO.DoctorDTO;
import com.example.server.dto.GeminiDTO.*;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.UserModels.Patient;
import com.example.server.service.CalendarServices.AppointmentService;
import com.example.server.service.UserServices.DoctorService;
import com.example.server.service.UserServices.PatientService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIDoctorAgentService {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final ConversationStore conversationStore;
    private final AIDoctorService aiDoctorService;
    private final PatientService patientService;

    public ResponseEntity<AIDoctorResponseDTO> handleUserMessage(AIDoctorRequestDTO requestDTO) {
        Patient patient = patientService.findById(requestDTO.getPatientId());
        String sessionId = patient.getEmail();
        String userMessage = requestDTO.getUserInputText();

        List<DoctorDTO> allDoctors = doctorService.getAllDoctorsDTO();
        conversationStore.addDoctorsList(sessionId, allDoctors);

        GeminiRequestDTO request = buildRequestBody(userMessage, sessionId, allDoctors);
        ResponseEntity<GeminiResponseDTO> response = aiDoctorService.callGeminiApi(
                aiDoctorService.buildHttpEntity(request)
        );

        String date = response.getHeaders().getFirst(HttpHeaders.DATE);
        AIDoctorResponseDTO dto = new AIDoctorResponseDTO();
        dto.setDate(date);

        GeminiResponseDTO geminiBody = response.getBody();
        String rawText = geminiBody.getCandidates()
            .get(0)
            .getContent()
            .getParts()
            .get(0)
            .getText();

        AIDoctorAgentResponseDTO agentResponseDTO = GeminiParser.parse(rawText);
        String answer = agentResponseDTO.getMessage();

        if (agentResponseDTO.getFunction() != null) {
            FunctionCallDTO functionCall = agentResponseDTO.getFunction();
            String functionName = functionCall.getName();
            Map<String, Object> args = functionCall.getArguments();
            System.out.println(functionName + args);
            Object result;

            switch (functionName) {
                case "findDoctors":
                    List<DoctorDTO> doctors = findDoctors(args.get("specialty"));

                    List<Map<String, Object>> formattedDoctors = doctors.stream()
                            .map(d -> {
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", d.getId());
                                map.put("name", d.getFirstName() + " " + d.getLastName());
                                map.put("specialization", d.getSpecialization());
                                map.put("slug", d.getSlug());
                                return map;
                            })
                            .toList();

                    result = formattedDoctors;

                    break;
                case "getDoctorDetails":
                    DoctorDTO doctor = getDoctorDetails(Long.valueOf(args.get("doctorId").toString()));

                    result = Map.of(
                            "id", doctor.getId(),
                            "name", doctor.getFirstName() + " " + doctor.getLastName(),
                            "specialization", doctor.getSpecialization(),
                            "slug", doctor.getSlug()
                    );

                    break;
                case "bookAppointment":
                    Appointment appt = bookAppointment(args, patient);

                    result = Map.of(
                            "appointmentId", appt.getId(),
                            "doctorId", appt.getDoctor().getId(),
                            "patientId", appt.getPatient().getId(),
                            "date", appt.getStartingTime().toLocalDate().toString(),
                            "time", appt.getStartingTime().toLocalTime().toString()
                    );

                    break;
                default:
                    throw new RuntimeException("Unknown function: " + functionName);
            }

            answer += "\n\n" + prettyPrint(result);
        }

        ContentDTO assistantContent = new ContentDTO();
        assistantContent.setRole("assistant");
        PartDTO part = new PartDTO();
        part.setText(answer);
        assistantContent.setParts(List.of(part));
        conversationStore.addMessage(sessionId, assistantContent);

        dto.setAnswer(answer);

        return ResponseEntity.ok(dto);
    }

    private String prettyPrint(Object obj) {
        try {
            return new ObjectMapper()
                    .writerWithDefaultPrettyPrinter()
                    .writeValueAsString(obj);
        } catch (Exception e) {
            return obj.toString();
        }
    }

    private GeminiRequestDTO buildRequestBody(String userInputText, String sessionId, List<DoctorDTO> doctors) {
        List<ContentDTO> history = conversationStore.getConversation(sessionId);

        List<Map<String, Object>> doctorsData = doctors.stream()
                .map(d -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", d.getId());
                    map.put("firstName", d.getFirstName());
                    map.put("lastName", d.getLastName());
                    map.put("fullName", d.getFirstName() + " " + d.getLastName());
                    map.put("specialization", d.getSpecialization());
                    map.put("email", d.getEmail());
                    map.put("slug", d.getSlug());
                    map.put("phone", d.getPhoneNumber());
                    return map;
                })
                .toList();

        PartDTO systemPart = new PartDTO();

        systemPart.setText("""
            You are a medical assistant chatbot. Your purpose is to provide information related to health, symptoms, conditions, and general medical advice.
            You must not answer any questions that are non-medical. If a user asks a question that is not health-related, provide a response like \\"I can only provide medical advice. Please ask a health-related question.
            Always respond in the language the user writes in. You may speak Bulgarian and English.
            Responsibilities:
            - Answer health questions
            - Suggest doctors
            - Help users book appointments
            
            Rules:
            - Never book without explicit confirmation
            - Ask for missing info (specialty, date, time, location)
            - Account for minor user spelling mistakes in specialties
            
            The current available doctors are: %s
            
            Format your response as JSON:
            {
              "message": "<your reply text>",
              "function": {
                "name": "<function name or null>",
                "arguments": { ... }
              }
            }
            
            Do not wrap your output in Markdown, code blocks, or ```json``` tags.
            When returning JSON, return raw JSON only, no formatting.

            Only use the functions:
            - findDoctors - requires arguments: specialty: string. Specialty is ONLY in English, so translate if needed
            - getDoctorDetails - requires arguments: doctorId: integer
            - bookAppointment - requires arguments: doctorId: integer, date: yyyy-MM-dd, start: HH:mm, comment: string
            """.formatted(doctorsData));

        SystemInstructionsDTO systemInstruction = new SystemInstructionsDTO();
        systemInstruction.setParts(List.of(systemPart));

        PartDTO userPart = new PartDTO();
        userPart.setText(userInputText);

        ContentDTO userContent = new ContentDTO();
        userContent.setRole("user");
        userContent.setParts(List.of(userPart));

        List<ContentDTO> contents = new ArrayList<>(history);
        contents.add(userContent);

        GeminiRequestDTO request = new GeminiRequestDTO();
        request.setSystemInstruction(systemInstruction);
        request.setContents(contents);

        return request;
    }

    public List<DoctorDTO> findDoctors(Object specialty) {
        List<DoctorDTO> doctors = doctorService.getAllDoctorsDTO();

        if (specialty != null) {
            doctors = doctors.stream().filter(doctor -> doctor.getSpecialization().equalsIgnoreCase(specialty.toString())).toList();
        }

        return doctors;
    }

    public DoctorDTO getDoctorDetails(Long doctorId) {
        var doctor = doctorService.findById(doctorId);
        return doctorService.getDoctorBySlug(doctor.getSlug());
    }

    private Appointment bookAppointment(Map<String, Object> args, Patient patient) {
        AppointmentCreateDTO dto = new AppointmentCreateDTO();

        dto.setDoctorId(Long.valueOf(args.get("doctorId").toString()));
        dto.setPatientId(patient.getId());
        dto.setDate(LocalDate.parse(args.get("date").toString()));
        dto.setStart(LocalTime.parse(args.get("start").toString()));
        dto.setComment(args.get("comment").toString());

        return appointmentService.createAppointment(dto);
    }

}
