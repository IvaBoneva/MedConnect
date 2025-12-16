package com.example.server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDTO {
    private String feedback;
    private Integer rating;
}
