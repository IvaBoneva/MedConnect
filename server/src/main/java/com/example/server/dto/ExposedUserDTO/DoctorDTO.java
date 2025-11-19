package com.example.server.dto.ExposedUserDTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO extends UserDTO{

    private String specialization;

    private Float rating;

}
