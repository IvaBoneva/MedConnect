package com.example.server.models.MedicalActionsModels;


import com.example.server.models.UserModels.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
public class MedicalProcedure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    private Set<User> users;;

    private String reason;

    private Boolean isDone;

}
