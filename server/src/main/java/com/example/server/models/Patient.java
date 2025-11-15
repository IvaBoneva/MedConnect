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
@Table(name = "patient")

public class Patient extends User {

    private String allergies;

    private String diseases;
}
