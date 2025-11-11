package com.example.server.config;

import com.example.server.models.Role;
import com.example.server.models.RolesEnum;
import com.example.server.models.User;
import com.example.server.repository.RoleRepository;
import com.example.server.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {

            // --- Seed roles only if missing ---
            for (RolesEnum r : RolesEnum.values()) {
                roleRepository.findByRole(r).orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setRole(r);
                    return roleRepository.save(newRole);
                });
            }

            System.out.println("✅ Roles seeded successfully!");

            if (userRepository.count() == 0) {
                // ✅ Now roles are managed entities (no detached entity problem)
                Role adminRole = roleRepository.findByRole(RolesEnum.Admin)
                        .orElseThrow(() -> new RuntimeException("Admin role missing"));
                Role patientRole = roleRepository.findByRole(RolesEnum.Patient)
                        .orElseThrow(() -> new RuntimeException("Patient role missing"));
                Role doctorRole = roleRepository.findByRole(RolesEnum.Doctor)
                        .orElseThrow(() -> new RuntimeException("Doctor role missing"));

                User user1 = new User();
                user1.setEmail("murtveca@example.com");
                user1.setPassword(passwordEncoder.encode("gooner123!"));
                user1.setName("Murt Veca");
                user1.setAge(24);
                user1.setPhoneNumber("123456789");
                user1.setRole(adminRole); // ✅ assign managed entity

                User user2 = new User();
                user2.setEmail("john_doe@example.com");
                user2.setPassword(passwordEncoder.encode("password123"));
                user2.setName("John Doe");
                user2.setAge(30);
                user2.setPhoneNumber("987654321");
                user2.setRole(patientRole);

                User user3 = new User();
                user3.setEmail("doctor@example.com");
                user3.setPassword(passwordEncoder.encode("doc123456"));
                user3.setName("Dr. Strange");
                user3.setAge(40);
                user3.setPhoneNumber("1122334455");
                user3.setRole(doctorRole);

                userRepository.save(user1);
                userRepository.save(user2);
                userRepository.save(user3);

                System.out.println("✅ Users seeded successfully!");
            }
        };
    }
}
