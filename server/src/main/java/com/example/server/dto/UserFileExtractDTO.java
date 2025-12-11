package com.example.server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class UserFileExtractDTO {
    private Long id;
    private String name;
    private Double size;
    private String type;
    private LocalDate dateOfUpload;
    private String fileCloudinaryUrl;
}
