package com.example.server.dto.ExposedUserDTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO extends UserDTO{

    private String specialization;

    private Float rating;

    private int yearsOfExperience;

    private String city;

    private String slug;

    private String hospital;
}
