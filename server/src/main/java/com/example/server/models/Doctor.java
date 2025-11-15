package com.example.server.models;

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
//@NoArgsConstructor
//@AllArgsConstructor
@Table(name = "doctor")

public class Doctor extends User{

    private String specialization;

    private Float rating;

}
