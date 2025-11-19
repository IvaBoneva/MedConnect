package com.example.server.dto.ExposedUserDTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientDTO extends UserDTO{

    private String allergies;

    private String diseases;

}
