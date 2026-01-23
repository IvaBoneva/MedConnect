package com.example.server.dto.GeminiDTO;

import com.example.server.service.AIDoctorServices.Action;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;
@Getter
@Setter
public class AIActionResponseDTO {


    private String message;


    private Action action;

    private Map<String, Object> data;
}
