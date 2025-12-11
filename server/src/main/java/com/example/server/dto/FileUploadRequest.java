package com.example.server.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileUploadRequest {
    private Long userId;
    private String fileCloudinaryUrl;
    private String name;         // File name
    private Double size;         // File size (in MB, or bytes depending on your choice)
    private String type;         // File type (e.g., "image/jpeg", "application/pdf", etc.)
    private String dateOfUpload; // Upload date as string (or LocalDateTime if you want exact date formatting)
}
