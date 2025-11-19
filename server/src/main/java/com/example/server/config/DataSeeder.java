package com.example.server.config;

import com.example.server.models.Doctor;
import com.example.server.models.Guardian;
import com.example.server.models.Patient;
import com.example.server.models.User;
//import DoctorRepository;
//import GuardianRepository;
import com.example.server.repository.UserRepositories.DoctorRepository;
import com.example.server.repository.UserRepositories.GuardianRepository;
import com.example.server.repository.UserRepositories.PatientRepository;
import com.example.server.repository.UserRepositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
                                   PatientRepository patientRepository,
                                   DoctorRepository doctorRepository,
                                   GuardianRepository guardianRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {

            if (userRepository.count() == 0) {

                // ----- Users -----
                User user1 = new User();
                user1.setFirstName("Murt");
                user1.setLastName("Veca");
                user1.setEmail("murtveca@example.com");
                user1.setPassword(passwordEncoder.encode("gooner123!"));
                user1.setAge(24);
                user1.setPhoneNumber("123456789");
                user1.setRole("Regular User");


                User user2 = new User();
                user2.setFirstName("John");
                user2.setLastName("Doe");
                user2.setEmail("john_doe@example.com");
                user2.setPassword(passwordEncoder.encode("password123"));
                user2.setAge(30);
                user2.setPhoneNumber("987654321");
                user2.setRole("Regular User");

                User user3 = new User();
                user3.setFirstName("Stephen");
                user3.setLastName("Strange");
                user3.setEmail("doctor@example.com");
                user3.setPassword(passwordEncoder.encode("doc123456"));
                user3.setAge(40);
                user3.setPhoneNumber("1122334455");
                user3.setRole("Regular User");

                // ----- Patient -----
                Patient patient = new Patient();
                patient.setFirstName("Peter");
                patient.setLastName("Parker");
                patient.setEmail("patient@example.com");
                patient.setPassword(passwordEncoder.encode("patient123"));
                patient.setAge(22);
                patient.setPhoneNumber("111222333");
                patient.setRole("PATIENT");

                // ----- Doctor -----
                Doctor doctor = new Doctor();
                doctor.setFirstName("Gregory");
                doctor.setLastName("House");
                doctor.setEmail("doctorhouse@example.com");
                    doctor.setPassword(passwordEncoder.encode("doc123456"));
                doctor.setAge(45);
                doctor.setPhoneNumber("125478963");
                doctor.setRole("DOCTOR");
                doctor.setSpecialization("Neurology");

                // ----- Guardian -----
                Guardian guardian = new Guardian();
                guardian.setFirstName("Martha");
                guardian.setLastName("Kent");
                guardian.setEmail("guardian@example.com");
                guardian.setPassword(passwordEncoder.encode("guardian123"));
                guardian.setAge(56);
                guardian.setPhoneNumber("147852369");
                guardian.setRole("GUARDIAN");
                guardian.setWardFirstName("Clark");
                guardian.setWardLastName("Kent");
                guardian.setWardAge(10);
                guardian.setIsWardDisabled(true);
                guardian.setWardDisabilityDescription("Requires walking assistance.");

                // ----- Save -----
                userRepository.save(user1);
                userRepository.save(user2);
                userRepository.save(user3);

                patientRepository.save(patient);
                doctorRepository.save(doctor);
                guardianRepository.save(guardian);

                System.out.println("✅ Users seeded successfully!");
            }
        };
    }
}
