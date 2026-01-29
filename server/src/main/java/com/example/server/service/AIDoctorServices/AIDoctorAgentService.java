package com.example.server.service.AIDoctorServices;

import com.example.server.config.SecurityUtils;
import com.example.server.dto.CalendarDTO.AppointmentCreateDTO;
import com.example.server.dto.CalendarDTO.DoctorWorkingTime;
import com.example.server.dto.ExposedUserDTO.DoctorDTO;
import com.example.server.dto.GeminiDTO.*;
import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Patient;
import com.example.server.models.UserModels.User;
import com.example.server.repository.CalendarRepositories.AppointmentRepository;
import com.example.server.service.CalendarServices.AppointmentService;
import com.example.server.service.UserServices.DoctorService;
import com.example.server.service.UserServices.PatientService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.util.DateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIDoctorAgentService {

    private final SecurityUtils securityUtils;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final ConversationStore conversationStore;
    private final AIDoctorService aiDoctorService;
    private final PatientService patientService;

    public ResponseEntity<AIDoctorResponseDTO> handleUserMessage(AIDoctorRequestDTO requestDTO) {
        User user = securityUtils.getCurrentUser();
        Patient patient = patientService.findById(user.getId());
        String sessionId = patient.getEmail();
        String userMessage = requestDTO.getUserInputText();

        PartDTO userPart = new PartDTO();
        userPart.setText(userMessage);

        ContentDTO userContent = new ContentDTO();
        userContent.setRole("user");
        userContent.setParts(List.of(userPart));

        conversationStore.addMessage(sessionId, userContent);

        List<DoctorDTO> allDoctors = doctorService.getAllDoctorsDTO();
//        conversationStore.addDoctorsList(sessionId, allDoctors);

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
            String result = "";

            switch (functionName) {
                case "findDoctors": {
                    List<DoctorDTO> doctors = findDoctors(args.get("specialty"));

                    List<String> formattedDoctors = doctors.stream()
                            .map(doctor -> {
                                StringBuilder stringBuilder = new StringBuilder();

                                stringBuilder
                                        .append("д-р ").append(doctor.getFirstName()).append(" ").append(doctor.getLastName())
                                        .append("\n")
                                        .append(doctor.getSpecialization())
                                        .append("\n")
                                        .append(doctor.getYearsOfExperience()).append(" години опит")
                                        .append("\n")
                                        .append(doctor.getHospital()).append(", ").append(doctor.getCity());

                                return stringBuilder.toString();
                            })
                            .toList();

                    result = String.join("\n\n", formattedDoctors);

                    break;
                }
                case "getDoctorDetails": {
                    DoctorDTO doctorDTO = getDoctorDetails(Long.valueOf(args.get("doctorId").toString()));

                    StringBuilder formattedDoctor = new StringBuilder();

                    formattedDoctor
                            .append("д-р ").append(doctorDTO.getFirstName()).append(" ").append(doctorDTO.getLastName())
                            .append("\n")
                            .append(doctorDTO.getSpecialization())
                            .append("\n")
                            .append(doctorDTO.getYearsOfExperience()).append(" години опит")
                            .append("\n")
                            .append(doctorDTO.getHospital()).append(", ").append(doctorDTO.getCity());

                    result = formattedDoctor.toString();

                    break;
                }
                case "getDoctorAvailableTimes": {
                    DoctorDTO doctorDTO = getDoctorDetails(Long.valueOf(args.get("doctorId").toString()));
                    LocalDate availableTimesDate = args.get("date") != null ? LocalDate.parse(args.get("date").toString()) : LocalDate.now();

                    result = getAvailableAppointmentTimesFormatted(doctorDTO.getId(), availableTimesDate);

                    break;
                }
                case "bookAppointment": {
                    AppointmentCreateDTO appointmentDTO = getAppointmentDTO(args, patient);

                    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy 'г.'");
                    DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm 'ч.'");

                    String appointmentFormattedDate = appointmentDTO.getDate().format(dateFormatter);

                    boolean appointmentExists = appointmentService.appointmentExists(appointmentDTO);

                    if (appointmentExists) {
                        String availableTimes = getAvailableAppointmentTimesFormatted(appointmentDTO.getDoctorId(), appointmentDTO.getDate());

                        StringBuilder formatted = new StringBuilder();

                        formatted
                                .append("Вече има записан час по това време. Налични часове на ")
                                .append(appointmentFormattedDate).append(":")
                                .append("\n\n")
                                .append(availableTimes);

                        answer = formatted.toString();

                        break;
                    }

                    boolean appointmentInRange = appointmentService.isAppointmentInRange(appointmentDTO);

                    if (!appointmentInRange) {
                        DoctorWorkingTime workingTime = appointmentService.getDoctorWorkingTime(appointmentDTO.getDoctorId(), appointmentDTO.getDate());

                        StringBuilder formatted = new StringBuilder();

                        formatted
                                .append("Посоченият час е в извънработно време. Работното време на доктора на ")
                                .append(appointmentFormattedDate).append(" е от ")
                                .append(workingTime.start().format(timeFormatter)).append(" до ").append(workingTime.end().format(timeFormatter));

                        answer = formatted.toString();

                        break;
                    }

                    boolean startTimeValid = appointmentService.isStartTimeValid(appointmentDTO);

                    if (!startTimeValid) {
                        String availableTimes = getAvailableAppointmentTimesFormatted(appointmentDTO.getDoctorId(), appointmentDTO.getDate());

                        StringBuilder formatted = new StringBuilder();

                        formatted
                                .append("Посоченият час е невалиден. Налични часове на ")
                                .append(appointmentFormattedDate).append(":")
                                .append("\n")
                                .append(availableTimes);

                        answer = formatted.toString();

                        break;
                    }

                    boolean appointmentInThePast = appointmentService.isAppointmentInThePast(appointmentDTO);

                    if (appointmentInThePast) {
                        answer = "Не може да записвате часове в миналото. Моля, изберете друг ден или час.";
                        break;
                    }

                    Appointment appointment = appointmentService.createAppointment(appointmentDTO);
                    Doctor doctor = appointment.getDoctor();

                    StringBuilder formattedAppointment = new StringBuilder();

                    formattedAppointment
                            .append("Информация за записан час:")
                            .append("\n")
                            .append("д-р ").append(doctor.getFirstName()).append(" ").append(doctor.getLastName())
                            .append("\n")
                            .append("Дата: ").append(appointment.getStartingTime().format(DateTimeFormatter.ofPattern("dd.MM.yyyy 'г. в' HH:mm 'ч.'")));

                    if (appointment.getComment() != null && !appointment.getComment().isEmpty()) {
                        formattedAppointment
                                .append("\n")
                                .append("Коментар: ").append(appointment.getComment());
                    }

                    answer = "Часът беше успешно записан!";
                    result = formattedAppointment.toString();

                    break;
                }
                default:
                    throw new RuntimeException("Unknown function: " + functionName);
            }

            if (!result.isEmpty()) {
                answer += "\n\n" + result;
            }
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

    private GeminiRequestDTO buildRequestBody(String userInputText, String sessionId, List<DoctorDTO> doctors) {
        List<ContentDTO> history = conversationStore.getConversation(sessionId);

        LocalDateTime currentDateTime = LocalDateTime.now();

        List<String> doctorsData = doctors.stream()
                .map(doctor -> {
                    StringBuilder stringBuilder = new StringBuilder();

                    stringBuilder
                            .append("Doctor ID (for internal use): ").append(doctor.getId())
                            .append("\n")
                            .append("First and last names: ").append(doctor.getFirstName()).append(" ").append(doctor.getLastName())
                            .append("\n")
                            .append("Email: ").append(doctor.getEmail())
                            .append("\n")
                            .append("Phone number: ").append(doctor.getPhoneNumber())
                            .append("\n")
                            .append("Specialisation: ").append(doctor.getSpecialization())
                            .append("\n")
                            .append("Years of experience: ").append(doctor.getYearsOfExperience())
                            .append("\n")
                            .append("Hospital and city: ").append(doctor.getHospital()).append(", ").append(doctor.getCity());

                    return stringBuilder.toString();
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
            
            Current date and time: %s
            
            Rules:
            - Always reply in JSON format, read below for details.
            - Never book without explicit confirmation. For other actions you do not need explicit permission to avoid asking the user a thousand times for a simple action.
            - Ask for missing info (specialty, date, time, location)
            - Account for minor user spelling mistakes in specialties
            - Always format dates in the format "dd.MM.yyyy" and times in the format "HH:mm". If date doesnt provide year, then use the year from the aforementioned current date. If time does not have minutes, then assume 00. E.g. if a user says "11" then assume "11:00".
            - Accept dates with day and month - do not accept weekdays.
            - Never have more than 1 question in a message at a time. Always separate questions in multiple messages and never repeat them.
            - Never ask the user for internal IDs of doctors and always tell the user which doctor you found for them before you book the appointment.
            - If the user previously mentioned date and/or time for appointment, use that and do not ask the user again the same question a thousand times.
            - If the user wants an appointment, first ask for the doctor and specialty, if not already provided in the original message.
            - Always ask the user if they want to add a comment to their appointment.
            - If a user asks about doctors, use the list below.
            - If the appointment start time is in the past according to the aforementioned current date, then tell the user that the appointment time is in the past and cannot be booked.
            - Handle user responses with relative date like "today", "tomorrow" etc. according to the aforementioned current date.
            - Never re-use appointment times from previous responses because there could have been a booking in the meantime. Always use the getDoctorAvailableTimes function when the user wants to see appointment times.
            - If the user specifies hour like clock hour directly (just the number) then handle that correctly.
            
            ---
            The current list of doctors is:
            %s
            ---
            
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
            NEVER SEND TEXT OUTSIDE OF THE JSON.

            Only use the functions:
            - findDoctors - requires arguments: specialty: string. Specialty is ONLY in English, so translate if needed. User may want all specialties, so in that case do not provide any argument.
            - getDoctorDetails - requires arguments: doctorId: integer
            - getDoctorAvailableTimes - requires arguments: doctorId: integer, date: yyyy-MM-dd. Returns the available (non-booked) appointment times for the doctor for the date. The date CAN be null - in such case it returns the times for TODAY. Use this if the user wants to know the available times for a doctor.
            - bookAppointment - requires arguments: doctorId: integer, date: yyyy-MM-dd, start: HH:mm, comment: string. Make sure to always put this function in the response if you are making an appointment, otherwise no appointment will be actually created. If the user does not provide a doctor, then give a list of the doctors with the specialty the user wants. If the user does not provide year, then take the year from the current date provided in this prompt. Accept times in 24 hour clock format, and also accept times that are not HH:mm. If minutes do not exist, then assume 0 for them. If the user responds with just a number, then that is the clock hour.
            """.formatted(
                currentDateTime.toString(),
                String.join("\n\n", doctorsData))
            );

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

    public String getAvailableAppointmentTimesFormatted(Long doctorId) {
        DoctorDTO doctorDTO = getDoctorDetails(doctorId);
        List<LocalTime> availableTimes = appointmentService.getAvailableAppointmentTimes(doctorDTO.getId());
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return String.join("\n", availableTimes.stream()
                .map(t -> t.format(timeFormatter))
                .toList()
        );
    }

    public String getAvailableAppointmentTimesFormatted(Long doctorId, LocalDate date) {
        DoctorDTO doctorDTO = getDoctorDetails(doctorId);
        List<LocalTime> availableTimes = appointmentService.getAvailableAppointmentTimes(doctorDTO.getId(), date);
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return String.join("\n", availableTimes.stream()
                .map(t -> t.format(timeFormatter))
                .toList()
        );
    }

    private AppointmentCreateDTO getAppointmentDTO(Map<String, Object> args, Patient patient) {
        AppointmentCreateDTO dto = new AppointmentCreateDTO();

        dto.setDoctorId(Long.valueOf(args.get("doctorId").toString()));
        dto.setPatientId(patient.getId());
        dto.setDate(LocalDate.parse(args.get("date").toString()));
        dto.setStart(LocalTime.parse(args.get("start").toString()));

        if (args.get("comment") != null) {
            dto.setComment(args.get("comment").toString());
        }

        return dto;
    }

}
