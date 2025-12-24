package com.example.server.models.UserModels;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Accessors(chain = true)

@Table(name = "guardian")
public class Guardian extends User {

    private String wardFirstName;

    private String wardLastName;

    private Integer wardAge;

    private LocalDate wardBirthday;

    private Boolean isWardDisabled;

    private String wardDisabilityDescription;

    private String wardAllergies;

    private String wardDiseases;
}
