package com.example.server.dto.GeminiDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIChatRequestDTO {
    private String conversationId;
    private String userInputText;
}
