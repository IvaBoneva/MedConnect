package com.example.server.models.MedicalActionsModels;


import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class PreventiveExamination extends MedicalProcedure{

    private int minimumAge;
}
