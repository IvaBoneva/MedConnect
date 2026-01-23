package com.example.server.dto.GeminiDTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class FunctionCallDTO {
    private String name;
    private Map<String, Object> arguments;
}
