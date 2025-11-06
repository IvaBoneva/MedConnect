package com.example.dto;

import com.example.enums.UserRole;

import lombok.Data;

@Data
public class UserDTO {
    private String firstName;
    private String lastName;
    private int age;
    private String email;
    private String phoneNumber;
    private String password;
    private UserRole role;

    private String specialization; // za doktorcheto
    private String kidFirstName;
    private String kidLastName;
    private String kidAge;
    private Boolean hasDisability;
    private String disabilityDesc;
}
