package com.example.server.config;

import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.CalendarModels.WeeklyScheduleTemplate;
import com.example.server.models.CalendarModels.WorkDayException;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Guardian;
import com.example.server.models.UserModels.Patient;
import com.example.server.models.UserModels.User;
import com.example.server.repository.CalendarRepositories.AppointmentRepository;
import com.example.server.repository.CalendarRepositories.WeeklyScheduleTemplateRepository;
import com.example.server.repository.CalendarRepositories.WorkDayExceptionRepository;
import com.example.server.repository.UserRepositories.DoctorRepository;
import com.example.server.repository.UserRepositories.GuardianRepository;
import com.example.server.repository.UserRepositories.PatientRepository;
import com.example.server.repository.UserRepositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            GuardianRepository guardianRepository,
            PasswordEncoder passwordEncoder,
            WeeklyScheduleTemplateRepository weeklyRepo,
            WorkDayExceptionRepository exceptionRepo,
            AppointmentRepository appointmentRepo
    ) {
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
                user1.setRole("user");

                User user2 = new User();
                user2.setFirstName("John");
                user2.setLastName("Doe");
                user2.setEmail("john_doe@example.com");
                user2.setPassword(passwordEncoder.encode("password123"));
                user2.setAge(30);
                user2.setPhoneNumber("987654321");
                user2.setRole("user");

                User user3 = new User();
                user3.setFirstName("Stephen");
                user3.setLastName("Strange");
                user3.setEmail("doctor@example.com");
                user3.setPassword(passwordEncoder.encode("doc123456"));
                user3.setAge(40);
                user3.setPhoneNumber("1122334455");
                user3.setRole("user");

                // ----- Patient -----
                Patient patient = new Patient();
                patient.setFirstName("Peter");
                patient.setLastName("Parker");
                patient.setEmail("patient@example.com");
                patient.setPassword(passwordEncoder.encode("patient123"));
                patient.setAge(22);
                patient.setPhoneNumber("111222333");
                patient.setRole("patient");

                Patient patient2 = new Patient();
                patient2.setFirstName("Tony");
                patient2.setLastName("Stark");
                patient2.setEmail("tony_stark@example.com");
                patient2.setPassword(passwordEncoder.encode("ironman123"));
                patient2.setAge(40);
                patient2.setPhoneNumber("444555666");
                patient2.setRole("patient");
                patientRepository.save(patient2);

                // ----- Doctors -----
                Doctor doctor1 = new Doctor();
                doctor1.setFirstName("Gregory");
                doctor1.setLastName("House");
                doctor1.setEmail("doctorhouse@example.com");
                doctor1.setPassword(passwordEncoder.encode("doc123456"));
                doctor1.setAge(45);
                doctor1.setPhoneNumber("125478963");
                doctor1.setRole("doctor");
                doctor1.setSpecialization("Neurology");
                doctor1.setRating(4.5F);
                doctor1.setCity("Sofia");
                doctor1.setYearsOfExperience(10);
                doctorRepository.save(doctor1);

                Doctor doctor2 = new Doctor();
                doctor2.setFirstName("John");
                doctor2.setLastName("Smith");
                doctor2.setEmail("doctorjohn@example.com");
                doctor2.setPassword(passwordEncoder.encode("doc123456"));
                doctor2.setAge(38);
                doctor2.setPhoneNumber("1122334455");
                doctor2.setRole("doctor");
                doctor2.setSpecialization("Cardiology");
                doctor2.setRating(4.2F);
                doctor2.setCity("New York");
                doctor2.setYearsOfExperience(8);

                Doctor doctor3 = new Doctor();
                doctor3.setFirstName("Alice");
                doctor3.setLastName("Jones");
                doctor3.setEmail("doctoralice@example.com");
                doctor3.setPassword(passwordEncoder.encode("doc123456"));
                doctor3.setAge(50);
                doctor3.setPhoneNumber("2233445566");
                doctor3.setRole("doctor");
                doctor3.setSpecialization("Orthopedics");
                doctor3.setRating(4.8F);
                doctor3.setCity("Los Angeles");
                doctor3.setYearsOfExperience(20);

                Doctor doctor4 = new Doctor();
                doctor4.setFirstName("Michael");
                doctor4.setLastName("Davis");
                doctor4.setEmail("doctormichael@example.com");
                doctor4.setPassword(passwordEncoder.encode("doc123456"));
                doctor4.setAge(40);
                doctor4.setPhoneNumber("3344556677");
                doctor4.setRole("doctor");
                doctor4.setSpecialization("Pediatrics");
                doctor4.setRating(4.7F);
                doctor4.setCity("Chicago");
                doctor4.setYearsOfExperience(12);

                Doctor doctor5 = new Doctor();
                doctor5.setFirstName("Sarah");
                doctor5.setLastName("Williams");
                doctor5.setEmail("doctorsarah@example.com");
                doctor5.setPassword(passwordEncoder.encode("doc123456"));
                doctor5.setAge(33);
                doctor5.setPhoneNumber("4455667788");
                doctor5.setRole("doctor");
                doctor5.setSpecialization("Gynecology");
                doctor5.setRating(4.3F);
                doctor5.setCity("San Francisco");
                doctor5.setYearsOfExperience(7);

                Doctor doctor6 = new Doctor();
                doctor6.setFirstName("David");
                doctor6.setLastName("Miller");
                doctor6.setEmail("doctordavid@example.com");
                doctor6.setPassword(passwordEncoder.encode("doc123456"));
                doctor6.setAge(48);
                doctor6.setPhoneNumber("5566778899");
                doctor6.setRole("doctor");
                doctor6.setSpecialization("Dermatology");
                doctor6.setRating(4.6F);
                doctor6.setCity("Miami");
                doctor6.setYearsOfExperience(15);

                Doctor doctor7 = new Doctor();
                doctor7.setFirstName("Eve");
                doctor7.setLastName("Taylor");
                doctor7.setEmail("doctoreve@example.com");
                doctor7.setPassword(passwordEncoder.encode("doc123456"));
                doctor7.setAge(29);
                doctor7.setPhoneNumber("6677889900");
                doctor7.setRole("doctor");
                doctor7.setSpecialization("Psychiatry");
                doctor7.setRating(4.4F);
                doctor7.setCity("Boston");
                doctor7.setYearsOfExperience(5);

                Doctor doctor8 = new Doctor();
                doctor8.setFirstName("William");
                doctor8.setLastName("Wilson");
                doctor8.setEmail("doctorwilliam@example.com");
                doctor8.setPassword(passwordEncoder.encode("doc123456"));
                doctor8.setAge(53);
                doctor8.setPhoneNumber("7788990011");
                doctor8.setRole("doctor");
                doctor8.setSpecialization("Surgery");
                doctor8.setRating(4.9F);
                doctor8.setCity("Houston");
                doctor8.setYearsOfExperience(25);

                Doctor doctor9 = new Doctor();
                doctor9.setFirstName("Olivia");
                doctor9.setLastName("Martinez");
                doctor9.setEmail("doctorolivia@example.com");
                doctor9.setPassword(passwordEncoder.encode("doc123456"));
                doctor9.setAge(36);
                doctor9.setPhoneNumber("8899001122");
                doctor9.setRole("doctor");
                doctor9.setSpecialization("Anesthesia");
                doctor9.setRating(4.6F);
                doctor9.setCity("Dallas");
                doctor9.setYearsOfExperience(10);

                Doctor doctor10 = new Doctor();
                doctor10.setFirstName("James");
                doctor10.setLastName("Moore");
                doctor10.setEmail("doctorjames@example.com");
                doctor10.setPassword(passwordEncoder.encode("doc123456"));
                doctor10.setAge(41);
                doctor10.setPhoneNumber("9900112233");
                doctor10.setRole("doctor");
                doctor10.setSpecialization("Radiology");
                doctor10.setRating(4.3F);
                doctor10.setCity("Seattle");
                doctor10.setYearsOfExperience(13);

                // ----- Guardian -----
                Guardian guardian = new Guardian();
                guardian.setFirstName("Martha");
                guardian.setLastName("Kent");
                guardian.setEmail("guardian@example.com");
                guardian.setPassword(passwordEncoder.encode("guardian123"));
                guardian.setAge(56);
                guardian.setPhoneNumber("147852369");
                guardian.setRole("guardian");
                guardian.setWardFirstName("Clark");
                guardian.setWardLastName("Kent");
                guardian.setWardAge(10);
                guardian.setIsWardDisabled(true);
                guardian.setWardDisabilityDescription("Requires walking assistance.");

                // ----- Save base data -----
                userRepository.save(user1);
                userRepository.save(user2);
                userRepository.save(user3);
                patientRepository.save(patient);

                doctorRepository.save(doctor2);
                doctorRepository.save(doctor3);
                doctorRepository.save(doctor4);
                doctorRepository.save(doctor5);
                doctorRepository.save(doctor6);
                doctorRepository.save(doctor7);
                doctorRepository.save(doctor8);
                doctorRepository.save(doctor9);
                doctorRepository.save(doctor10);

                guardianRepository.save(guardian);

                // ===========================
                //   DOCTOR HOUSE SCHEDULE
                // ===========================







                // ===========================
                //     SAMPLE APPOINTMENTS
                // ===========================


                List<WeeklyScheduleTemplate> week = new ArrayList<>();

                for (DayOfWeek dow : DayOfWeek.values()) {
                    WeeklyScheduleTemplate t = new WeeklyScheduleTemplate();
                    t.setDoctor(doctor1);
                    t.setDayOfWeek(dow);

                    if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                        t.setWorking(false);
                    } else {
                        t.setWorking(true);
                        t.setStartTime(LocalTime.of(9, 0));
                        t.setEndTime(LocalTime.of(17, 0));
                        t.setSlotDurationMinutes(30);
                    }

                    week.add(t);
                }

                weeklyRepo.saveAll(week);


// ===========================
//     EXCEPTION IN NOVEMBER
// ===========================

// Doctor is OFF on November 15, 2025
                WorkDayException ex = new WorkDayException();
                ex.setDoctor(doctor1);
                ex.setDate(LocalDate.of(2025, 11, 14));
                ex.setWorking(false);
                exceptionRepo.save(ex);

                WorkDayException ex2 = new WorkDayException();
                ex2.setDoctor(doctor1);
                ex2.setDate(LocalDate.of(2025, 11, 13));
                ex2.setWorking(true);  // The doctor is working this day

// Set the overridden start and end times
                ex2.setOverrideStartTime(LocalTime.of(13, 0));  // Start time at 13:00
                ex2.setOverrideEndTime(LocalTime.of(18, 0));
                exceptionRepo.save(ex2);


// ===========================
//     SAMPLE APPOINTMENTS
// ===========================

                Appointment a1 = new Appointment();
                a1.setDoctor(doctor1);
                a1.setPatient(patient);
                a1.setStartingTime(LocalDateTime.of(2025, 11, 10, 10, 0));
                a1.setDurationInMinutes(30L);  // REQUIRED to avoid crash
                a1.setStatus(Appointment.Status.Cancelled);
                a1.setComment("Fairly Ill but still walking like a teen");

                Appointment a2 = new Appointment();
                a2.setDoctor(doctor1);
                a2.setPatient(patient2);
                a2.setStartingTime(LocalDateTime.of(2025, 11, 10, 14, 0));
                a2.setDurationInMinutes(30L);  // REQUIRED to avoid crash
                a2.setStatus(Appointment.Status.Booked);
                a2.setComment("I am really Ill brother");

                appointmentRepo.save(a1);
                appointmentRepo.save(a2);


                System.out.println("✅ Users, doctors, schedules, and appointments seeded successfully!");
            }
        };
    }
}
