package com.example.server.dto.GeminiDTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GeminiResponseDTO {
    private List<CandidateDTO> candidates;

}
