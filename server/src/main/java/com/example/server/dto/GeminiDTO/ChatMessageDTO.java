package com.example.server.dto.GeminiDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDTO {
    private String role;
    private String text;
    private Object data;
}
