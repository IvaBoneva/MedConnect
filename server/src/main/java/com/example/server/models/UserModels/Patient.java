package com.example.server.models.UserModels;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;


@Getter
@Setter
@Accessors(chain = true)
@Entity
@Table(name = "patient")

public class Patient extends User {

    private String allergies;

    private String diseases;

}
