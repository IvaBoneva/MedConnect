package com.example.server.models;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("GUARDIAN")
@Table(name = "guardian")
public class Guardian extends User{

    @Column(name = "ward_first_name")
    private String wardFirstName;

    @Column(name = "ward_last_name")
    private String wardLastName;

    @Column(name = "ward_age")
    private int wardAge;

    @Column(name = "is_ward_disabled")
    private Boolean isWardDisabled;

    @Column(name = "ward_disability_description")
    private String wardDisabilityDescription;

    @Column(name = "ward_allergies")
    private String wardAllergies;

    @Column(name = "ward_diseases")
    private String wardDiseases;
}

