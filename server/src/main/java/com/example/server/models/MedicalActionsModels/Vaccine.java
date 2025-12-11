package com.example.server.models.MedicalActionsModels;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Vaccine extends MedicalProcedure{

    private int exactAge;
}
