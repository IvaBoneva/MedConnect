package com.example.server.dto.GeminiDTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class GeminiRequestDTO {

    private SystemInstructionsDTO systemInstruction;
    private List<ContentDTO> contents;
    private Map<String, Object> generationConfig;


}
