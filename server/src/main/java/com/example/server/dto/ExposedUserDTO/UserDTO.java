package com.example.server.dto.ExposedUserDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;

    private String firstName;
    private String lastName;

    private String email;

    private int age;
    private String phoneNumber;
    private String role;

    private String subscription = "free";
    private LocalDate subscriptionExpiry;

    private LocalDate created_at = LocalDate.now();

    private String photoURL;

}
