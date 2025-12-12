package com.example.server.config;

import com.example.server.models.CalendarModels.Appointment;
import com.example.server.models.CalendarModels.WeeklyScheduleTemplate;
import com.example.server.models.CalendarModels.WorkDayException;
import com.example.server.models.StorageModels.Storage;
import com.example.server.models.StorageModels.UserFile;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Guardian;
import com.example.server.models.UserModels.Patient;
import com.example.server.models.UserModels.User;
import com.example.server.repository.CalendarRepositories.AppointmentRepository;
import com.example.server.repository.CalendarRepositories.WeeklyScheduleTemplateRepository;
import com.example.server.repository.CalendarRepositories.WorkDayExceptionRepository;
import com.example.server.repository.StorageRepositories.StorageRepository;
import com.example.server.repository.StorageRepositories.UserFileRepository;
import com.example.server.repository.UserRepositories.DoctorRepository;
import com.example.server.repository.UserRepositories.GuardianRepository;
import com.example.server.repository.UserRepositories.PatientRepository;
import com.example.server.repository.UserRepositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.*;
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
            AppointmentRepository appointmentRepo,
            StorageRepository storageRepository,
            UserFileRepository userFileRepository
    ) {
        return args -> {

            if (userRepository.count() == 0) {

                // ========================
                // USERS
                // ========================
                User user1 = new User();
                user1.setFirstName("Murt");
                user1.setLastName("Veca");
                user1.setEmail("murtveca@example.com");
                user1.setPassword(passwordEncoder.encode("gooner123!"));
                user1.setBirthDate(LocalDate.of(2001, 1, 1));
                user1.setAge(24);
                user1.setPhoneNumber("123456789");
                user1.setRole("user");

                User user2 = new User();
                user2.setFirstName("John");
                user2.setLastName("Doe");
                user2.setEmail("john_doe@example.com");
                user2.setPassword(passwordEncoder.encode("password123"));
                user2.setBirthDate(LocalDate.of(1994, 1, 1));
                user2.setAge(30);
                user2.setPhoneNumber("987654321");
                user2.setRole("user");

                User user3 = new User();
                user3.setFirstName("Stephen");
                user3.setLastName("Strange");
                user3.setEmail("doctor@example.com");
                user3.setPassword(passwordEncoder.encode("doc123456"));
                user3.setBirthDate(LocalDate.of(1984, 1, 1));
                user3.setAge(40);
                user3.setPhoneNumber("1122334455");
                user3.setRole("user");

                // ========================
                // PATIENTS
                // ========================
                Patient patient = new Patient();
                patient.setFirstName("Peter");
                patient.setLastName("Parker");
                patient.setEmail("patient@example.com");
                patient.setPassword(passwordEncoder.encode("patient123"));
                patient.setBirthDate(LocalDate.of(2003, 1, 1));
                patient.setAge(22);
                patient.setPhoneNumber("111222333");
                patient.setRole("patient");
                patientRepository.save(patient);

                Storage storage = new Storage();
                storage.setUser(patient);
                storageRepository.save(storage);

                UserFile file1 = new UserFile();
                file1.setName("samplefile1.jpg");
                file1.setSize(2048.0);
                file1.setType("image/jpeg");
                file1.setDateOfUpload(LocalDate.now());
                file1.setFileCloudinaryUrl("https://res.cloudinary.com/demo/image/upload/v1/samplefile1");
                file1.setStorage(storage);

                UserFile file2 = new UserFile();
                file2.setName("samplefile2.jpg");
                file2.setSize(1024.0);
                file2.setType("image/jpeg");
                file2.setDateOfUpload(LocalDate.now());
                file2.setFileCloudinaryUrl("https://res.cloudinary.com/demo/image/upload/v1/samplefile2");
                file2.setStorage(storage);

                userFileRepository.save(file1);
                userFileRepository.save(file2);

                Patient patient2 = new Patient();
                patient2.setFirstName("Tony");
                patient2.setLastName("Stark");
                patient2.setEmail("tony_stark@example.com");
                patient2.setPassword(passwordEncoder.encode("ironman123"));
                patient2.setBirthDate(LocalDate.of(1985, 1, 1));
                patient2.setAge(40);
                patient2.setPhoneNumber("444555666");
                patient2.setRole("patient");
                patientRepository.save(patient2);

                Patient patient3 = new Patient();
                patient3.setFirstName("Bruce");
                patient3.setLastName("Wayne");
                patient3.setEmail("brucewayne@example.com");
                patient3.setPassword(passwordEncoder.encode("bruce123"));
                patient3.setBirthDate(LocalDate.of(1989, 1, 1));
                patient3.setAge(35);
                patient3.setPhoneNumber("123123123");
                patient3.setRole("patient");
                patientRepository.save(patient3);

                Patient patient4 = new Patient();
                patient4.setFirstName("Clark");
                patient4.setLastName("Kent");
                patient4.setEmail("clarkkent@example.com");
                patient4.setPassword(passwordEncoder.encode("clark123"));
                patient4.setBirthDate(LocalDate.of(1991, 1, 1));
                patient4.setAge(33);
                patient4.setPhoneNumber("234234234");
                patient4.setRole("patient");
                patientRepository.save(patient4);

                Patient patient5 = new Patient();
                patient5.setFirstName("Diana");
                patient5.setLastName("Prince");
                patient5.setEmail("dianaprince@example.com");
                patient5.setPassword(passwordEncoder.encode("wonderwoman123"));
                patient5.setBirthDate(LocalDate.of(1994, 1, 1));
                patient5.setAge(30);
                patient5.setPhoneNumber("345345345");
                patient5.setRole("patient");
                patientRepository.save(patient5);

                Patient patient6 = new Patient();
                patient6.setFirstName("Barry");
                patient6.setLastName("Allen");
                patient6.setEmail("barryallen@example.com");
                patient6.setPassword(passwordEncoder.encode("flash123"));
                patient6.setBirthDate(LocalDate.of(1996, 1, 1));
                patient6.setAge(28);
                patient6.setPhoneNumber("456456456");
                patient6.setRole("patient");
                patientRepository.save(patient6);

                // ========================
                // DOCTORS
                // ========================
                Doctor doctor1 = new Doctor();
                doctor1.setFirstName("Gregory");
                doctor1.setLastName("House");
                doctor1.setEmail("doctorhouse@example.com");
                doctor1.setPassword(passwordEncoder.encode("doc123456"));
                doctor1.setBirthDate(LocalDate.of(1980, 1, 1));
                doctor1.setAge(45);
                doctor1.setPhoneNumber("125478963");
                doctor1.setRole("doctor");
                doctor1.setSpecialization("Neurology");
                doctor1.setRating(4.5F);
                doctor1.setYearsOfExperience(10);
                doctor1.setHospital("УМБАЛСМ Н.И.Пирогов");
                doctor1.setCity("София");
                doctorRepository.save(doctor1);

                Doctor doctor2 = new Doctor();
                doctor2.setFirstName("John");
                doctor2.setLastName("Smith");
                doctor2.setEmail("doctorjohn@example.com");
                doctor2.setPassword(passwordEncoder.encode("doc123456"));
                doctor2.setBirthDate(LocalDate.of(1986, 1, 1));
                doctor2.setAge(38);
                doctor2.setPhoneNumber("1122334455");
                doctor2.setRole("doctor");
                doctor2.setSpecialization("Cardiology");
                doctor2.setRating(4.2F);
                doctor2.setYearsOfExperience(8);
                doctor2.setHospital("УМБАЛ Света Анна");
                doctor2.setCity("София");

                Doctor doctor3 = new Doctor();
                doctor3.setFirstName("Alice");
                doctor3.setLastName("Jones");
                doctor3.setEmail("doctoralice@example.com");
                doctor3.setPassword(passwordEncoder.encode("doc123456"));
                doctor3.setBirthDate(LocalDate.of(1974, 1, 1));
                doctor3.setAge(50);
                doctor3.setPhoneNumber("2233445566");
                doctor3.setRole("doctor");
                doctor3.setSpecialization("Orthopedics");
                doctor3.setRating(4.8F);
                doctor3.setYearsOfExperience(20);
                doctor3.setHospital("УМБАЛ Александровска");
                doctor3.setCity("София");

                Doctor doctor4 = new Doctor();
                doctor4.setFirstName("Michael");
                doctor4.setLastName("Davis");
                doctor4.setEmail("doctormichael@example.com");
                doctor4.setPassword(passwordEncoder.encode("doc123456"));
                doctor4.setBirthDate(LocalDate.of(1984, 1, 1));
                doctor4.setAge(40);
                doctor4.setPhoneNumber("3344556677");
                doctor4.setRole("doctor");
                doctor4.setSpecialization("Pediatrics");
                doctor4.setRating(4.7F);
                doctor4.setYearsOfExperience(12);
                doctor4.setHospital("УМБАЛ „Св. Георги“");
                doctor4.setCity("Пловдив");

                Doctor doctor5 = new Doctor();
                doctor5.setFirstName("Sarah");
                doctor5.setLastName("Williams");
                doctor5.setEmail("doctorsarah@example.com");
                doctor5.setPassword(passwordEncoder.encode("doc123456"));
                doctor5.setBirthDate(LocalDate.of(1991, 1, 1));
                doctor5.setAge(33);
                doctor5.setPhoneNumber("4455667788");
                doctor5.setRole("doctor");
                doctor5.setSpecialization("Gynecology");
                doctor5.setRating(4.3F);
                doctor5.setYearsOfExperience(7);
                doctor5.setHospital("УМБАЛ „Света Марина“");
                doctor5.setCity("Варна");

                Doctor doctor6 = new Doctor();
                doctor6.setFirstName("David");
                doctor6.setLastName("Miller");
                doctor6.setEmail("doctordavid@example.com");
                doctor6.setPassword(passwordEncoder.encode("doc123456"));
                doctor6.setBirthDate(LocalDate.of(1976, 1, 1));
                doctor6.setAge(48);
                doctor6.setPhoneNumber("5566778899");
                doctor6.setRole("doctor");
                doctor6.setSpecialization("Dermatology");
                doctor6.setRating(4.6F);
                doctor6.setYearsOfExperience(15);
                doctor6.setHospital("УМБАЛ „Софиямед“");
                doctor6.setCity("София");

                Doctor doctor7 = new Doctor();
                doctor7.setFirstName("Eve");
                doctor7.setLastName("Taylor");
                doctor7.setEmail("doctoreve@example.com");
                doctor7.setPassword(passwordEncoder.encode("doc123456"));
                doctor7.setBirthDate(LocalDate.of(1995, 1, 1));
                doctor7.setAge(29);
                doctor7.setPhoneNumber("6677889900");
                doctor7.setRole("doctor");
                doctor7.setSpecialization("Psychiatry");
                doctor7.setRating(4.4F);
                doctor7.setYearsOfExperience(5);
                doctor7.setHospital("УМБАЛ „Софиямед“");
                doctor7.setCity("София");

                Doctor doctor8 = new Doctor();
                doctor8.setFirstName("William");
                doctor8.setLastName("Wilson");
                doctor8.setEmail("doctorwilliam@example.com");
                doctor8.setPassword(passwordEncoder.encode("doc123456"));
                doctor8.setBirthDate(LocalDate.of(1971, 1, 1));
                doctor8.setAge(53);
                doctor8.setPhoneNumber("7788990011");
                doctor8.setRole("doctor");
                doctor8.setSpecialization("Surgery");
                doctor8.setRating(4.9F);
                doctor8.setYearsOfExperience(25);
                doctor8.setHospital("УМБАЛ „Токуда“");
                doctor8.setCity("София");

                Doctor doctor9 = new Doctor();
                doctor9.setFirstName("Olivia");
                doctor9.setLastName("Martinez");
                doctor9.setEmail("doctorolivia@example.com");
                doctor9.setPassword(passwordEncoder.encode("doc123456"));
                doctor9.setBirthDate(LocalDate.of(1988, 1, 1));
                doctor9.setAge(36);
                doctor9.setPhoneNumber("8899001122");
                doctor9.setRole("doctor");
                doctor9.setSpecialization("Anesthesia");
                doctor9.setRating(4.6F);
                doctor9.setYearsOfExperience(10);
                doctor9.setHospital("УМБАЛ „Медика“");
                doctor9.setCity("Русе");

                Doctor doctor10 = new Doctor();
                doctor10.setFirstName("James");
                doctor10.setLastName("Moore");
                doctor10.setEmail("doctorjames@example.com");
                doctor10.setPassword(passwordEncoder.encode("doc123456"));
                doctor10.setBirthDate(LocalDate.of(1983, 1, 1));
                doctor10.setAge(41);
                doctor10.setPhoneNumber("9900112233");
                doctor10.setRole("doctor");
                doctor10.setSpecialization("Radiology");
                doctor10.setRating(4.3F);
                doctor10.setYearsOfExperience(13);
                doctor10.setHospital("УМБАЛ „Лозенец“");
                doctor10.setCity("София");

                // ========================
                // GUARDIAN
                // ========================
                Guardian guardian = new Guardian();
                guardian.setFirstName("Martha");
                guardian.setLastName("Kent");
                guardian.setEmail("guardian@example.com");
                guardian.setPassword(passwordEncoder.encode("guardian123"));
                guardian.setBirthDate(LocalDate.of(1968, 1, 1));
                guardian.setAge(56);
                guardian.setPhoneNumber("147852369");
                guardian.setRole("guardian");
                guardian.setWardFirstName("Clark");
                guardian.setWardLastName("Kent");
                guardian.setWardBirthday(LocalDate.of(2015, 1, 1));
                guardian.setWardAge(10);
                guardian.setIsWardDisabled(true);
                guardian.setWardDisabilityDescription("Requires walking assistance.");

                // ========================
                // SAVE ALL
                // ========================
                userRepository.save(user1);
                userRepository.save(user2);
                userRepository.save(user3);

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

                // ========================
                // SCHEDULES
                // ========================
                List<Doctor> allDoctors = doctorRepository.findAll();
                List<WeeklyScheduleTemplate> allSchedules = new ArrayList<>();

                for (Doctor doctor : allDoctors) {
                    for (DayOfWeek dow : DayOfWeek.values()) {
                        WeeklyScheduleTemplate t = new WeeklyScheduleTemplate();
                        t.setDoctor(doctor);
                        t.setDayOfWeek(dow);

                        if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                            t.setWorking(false);
                        } else {
                            t.setWorking(true);
                            t.setStartTime(LocalTime.of(9, 0));
                            t.setEndTime(LocalTime.of(17, 0));
                            t.setSlotDurationMinutes(30);
                        }
                        allSchedules.add(t);
                    }
                }

                weeklyRepo.saveAll(allSchedules);

                // ========================
                // EXCEPTIONS
                // ========================
                WorkDayException ex = new WorkDayException();
                ex.setDoctor(doctor1);
                ex.setDate(LocalDate.of(2025, 11, 14));
                ex.setWorking(false);
                exceptionRepo.save(ex);

                WorkDayException ex2 = new WorkDayException();
                ex2.setDoctor(doctor1);
                ex2.setDate(LocalDate.of(2025, 11, 13));
                ex2.setWorking(true);
                ex2.setOverrideStartTime(LocalTime.of(13, 0));
                ex2.setOverrideEndTime(LocalTime.of(18, 0));
                exceptionRepo.save(ex2);

                // ========================
                // APPOINTMENTS
                // ========================
                Appointment a1 = new Appointment();
                a1.setDoctor(doctor1);
                a1.setPatient(patient);
                a1.setStartingTime(LocalDateTime.of(2025, 11, 10, 10, 0));
                a1.setDurationInMinutes(30L);
                a1.setStatus(Appointment.Status.Completed);
                a1.setComment("Fairly Ill but still walking like a teen");

                Appointment a2 = new Appointment();
                a2.setDoctor(doctor1);
                a2.setPatient(patient2);
                a2.setStartingTime(LocalDateTime.of(2025, 11, 10, 14, 0));
                a2.setDurationInMinutes(30L);
                a2.setStatus(Appointment.Status.Booked);
                a2.setComment("I am really Ill brother");

                appointmentRepo.save(a1);
                appointmentRepo.save(a2);

                System.out.println("✅ Users, doctors, schedules, and appointments seeded successfully!");
            }
        };
    }
}
