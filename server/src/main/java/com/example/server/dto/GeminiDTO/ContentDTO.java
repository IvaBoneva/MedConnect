package com.example.server.dto.GeminiDTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ContentDTO {
    private String role;
    private List<PartDTO> parts;

}
