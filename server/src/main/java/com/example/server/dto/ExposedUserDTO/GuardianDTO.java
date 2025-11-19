package com.example.server.dto.ExposedUserDTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GuardianDTO extends UserDTO{

    private String wardFirstName;

    private String wardLastName;

    private int wardAge;

    private Boolean isWardDisabled;

    private String wardDisabilityDescription;

    private String wardAllergies;

    private String wardDiseases;


}
