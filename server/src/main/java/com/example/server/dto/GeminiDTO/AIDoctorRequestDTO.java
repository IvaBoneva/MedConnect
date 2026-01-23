package com.example.server.dto.GeminiDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIDoctorRequestDTO {
    private String userInputText;
    private Long patientId;
}
