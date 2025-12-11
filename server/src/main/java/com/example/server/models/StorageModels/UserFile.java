package com.example.server.models.StorageModels;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class UserFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Double size;

    private String type;

    private LocalDate dateOfUpload;

    private String fileCloudinaryUrl;

    @ManyToOne
    private Storage storage;
}
