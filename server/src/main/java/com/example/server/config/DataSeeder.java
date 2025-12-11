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
            AppointmentRepository appointmentRepo,
            StorageRepository storageRepository,
            UserFileRepository userFileRepository
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
                patientRepository.save(patient);



                Storage storage = new Storage();
                storage.setUser(patient); // Associate the storage with the patient

// Save the Storage to the database
                storageRepository.save(storage);

                UserFile file1 = new UserFile();
                file1.setName("samplefile1.jpg");
                file1.setSize(2048.0); // Size in KB (example 2MB)
                file1.setType("image/jpeg");
                file1.setDateOfUpload(LocalDate.now());
                file1.setFileCloudinaryUrl("https://res.cloudinary.com/demo/image/upload/v1/samplefile1"); // Example Cloudinary URL
                file1.setStorage(storage); // Link the file to the storage

                // Create a sample file2
                UserFile file2 = new UserFile();
                file2.setName("samplefile2.jpg");
                file2.setSize(1024.0); // Size in KB (example 1MB)
                file2.setType("image/jpeg");
                file2.setDateOfUpload(LocalDate.now());
                file2.setFileCloudinaryUrl("https://res.cloudinary.com/demo/image/upload/v1/samplefile2"); // Example Cloudinary URL
                file2.setStorage(storage); // Link the file to the storage

                // Save the files to the database
                userFileRepository.save(file1);
                userFileRepository.save(file2);

                Patient patient2 = new Patient();
                patient2.setFirstName("Tony");
                patient2.setLastName("Stark");
                patient2.setEmail("tony_stark@example.com");
                patient2.setPassword(passwordEncoder.encode("ironman123"));
                patient2.setAge(40);
                patient2.setPhoneNumber("444555666");
                patient2.setRole("patient");
                patientRepository.save(patient2);

                Patient patient3 = new Patient();
                patient3.setFirstName("Bruce");
                patient3.setLastName("Wayne");
                patient3.setEmail("brucewayne@example.com");
                patient3.setPassword(passwordEncoder.encode("bruce123"));
                patient3.setAge(35);
                patient3.setPhoneNumber("123123123");
                patient3.setRole("patient");
                patientRepository.save(patient3);

                Patient patient4 = new Patient();
                patient4.setFirstName("Clark");
                patient4.setLastName("Kent");
                patient4.setEmail("clarkkent@example.com");
                patient4.setPassword(passwordEncoder.encode("clark123"));
                patient4.setAge(33);
                patient4.setPhoneNumber("234234234");
                patient4.setRole("patient");
                patientRepository.save(patient4);

                Patient patient5 = new Patient();
                patient5.setFirstName("Diana");
                patient5.setLastName("Prince");
                patient5.setEmail("dianaprince@example.com");
                patient5.setPassword(passwordEncoder.encode("wonderwoman123"));
                patient5.setAge(30);
                patient5.setPhoneNumber("345345345");
                patient5.setRole("patient");
                patientRepository.save(patient5);

                Patient patient6 = new Patient();
                patient6.setFirstName("Barry");
                patient6.setLastName("Allen");
                patient6.setEmail("barryallen@example.com");
                patient6.setPassword(passwordEncoder.encode("flash123"));
                patient6.setAge(28);
                patient6.setPhoneNumber("456456456");
                patient6.setRole("patient");
                patientRepository.save(patient6);

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
                doctor1.setYearsOfExperience(10);
                doctor1.setHospital("УМБАЛСМ Н.И.Пирогов"); // Neurology
                doctor1.setCity("София");
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
                doctor2.setYearsOfExperience(8);

                doctor2.setHospital("УМБАЛ Света Анна"); // Cardiology
                doctor2.setCity("София");

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
                doctor3.setYearsOfExperience(20);

                doctor3.setHospital("УМБАЛ Александровска"); // Orthopedics
                doctor3.setCity("София");


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
                doctor4.setYearsOfExperience(12);

                doctor4.setHospital("УМБАЛ „Св. Георги“"); // Pediatrics
                doctor4.setCity("Пловдив");

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
                doctor5.setYearsOfExperience(7);
                doctor5.setHospital("УМБАЛ „Света Марина“"); // Gynecology
                doctor5.setCity("Варна");


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
                doctor6.setYearsOfExperience(15);
                doctor6.setHospital("УМБАЛ „Софиямед“"); // Dermatology
                doctor6.setCity("София");

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
                doctor7.setYearsOfExperience(5);
                doctor7.setHospital("УМБАЛ „Софиямед“"); // Psychiatry
                doctor7.setCity("София");

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
                doctor8.setYearsOfExperience(25);
                doctor8.setHospital("УМБАЛ „Токуда“"); // Surgery
                doctor8.setCity("София");

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
                doctor9.setYearsOfExperience(10);
                doctor9.setHospital("УМБАЛ „Медика“"); // Anesthesia
                doctor9.setCity("Русе");

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
                doctor10.setYearsOfExperience(13);
                doctor10.setHospital("УМБАЛ „Лозенец“"); // Radiology
                doctor10.setCity("София");

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
                a1.setStatus(Appointment.Status.Completed);
                a1.setComment("Fairly Ill but still walking like a teen");

                Appointment a2 = new Appointment();
                a2.setDoctor(doctor1);
                a2.setPatient(patient2);
                a2.setStartingTime(LocalDateTime.of(2025, 11, 10, 14, 0));
                a2.setDurationInMinutes(30L);  // REQUIRED to avoid crash
                a2.setStatus(Appointment.Status.Booked);
                a2.setComment("I am really Ill brother");
//
                Appointment a4 = new Appointment();
                a4.setDoctor(doctor1);  // doctor1 is assumed to be Doctor House
                a4.setPatient(patient5);  // You can assign any patient here
                a4.setStartingTime(LocalDateTime.of(2025, 11, 11, 15, 0));
                a4.setDurationInMinutes(30L);  // REQUIRED to avoid crash
                a4.setStatus(Appointment.Status.Completed);
                a4.setComment("The patient had a headache and mild fever. Doctor administered treatment and gave guidelines.");
                a4.setFeedback("The headache reduced within an hour, and the fever subsided by evening. Very helpful!");
                appointmentRepo.save(a4);

                Appointment a5 = new Appointment();
                a5.setDoctor(doctor1);  // doctor1 is assumed to be Doctor House
                a5.setPatient(patient4);  // You can assign any patient here
                a5.setStartingTime(LocalDateTime.of(2025, 11, 12, 9, 0));
                a5.setDurationInMinutes(30L);  // REQUIRED to avoid crash
                a5.setStatus(Appointment.Status.Completed);
                a5.setComment("Patient arrived with a stomach ache. After diagnosis, prescribed medication for relief.");
                a5.setFeedback("The stomach ache reduced after taking the prescribed medications. I am feeling better.");
                appointmentRepo.save(a5);

                Appointment a6 = new Appointment();
                a6.setDoctor(doctor1);  // doctor1 is assumed to be Doctor House
                a6.setPatient(patient2);  // You can assign any patient here
                a6.setStartingTime(LocalDateTime.of(2025, 11, 13, 13, 0));
                a6.setDurationInMinutes(30L);  // REQUIRED to avoid crash
                a6.setStatus(Appointment.Status.Completed);
                a6.setComment("The patient complained about chest tightness. After examination, prescribed medication for relief.");
                a6.setFeedback("The medication helped relieve the chest tightness. I am able to breathe easily now.");
                appointmentRepo.save(a6);


                Appointment a7 = new Appointment();
                a7.setDoctor(doctor1);  // doctor1 is assumed to be Doctor House
                a7.setPatient(patient6);  // You can assign any patient here
                a7.setStartingTime(LocalDateTime.of(2025, 11, 15, 10, 0));
                a7.setDurationInMinutes(30L);  // REQUIRED to avoid crash
                a7.setStatus(Appointment.Status.Completed);
                a7.setComment("Patient came in with mild pain in the lower back. After assessment, prescribed treatment.");
                a7.setFeedback("Pain relief was immediate, and patient felt better after following treatment instructions.");
                appointmentRepo.save(a7);

                Appointment a8 = new Appointment();
                a8.setDoctor(doctor1);  // doctor1 is assumed to be Doctor House
                a8.setPatient(patient2);  // You can assign any patient here
                a8.setStartingTime(LocalDateTime.of(2025, 11, 16, 14, 30));
                a8.setDurationInMinutes(30L);  // REQUIRED to avoid crash
                a8.setStatus(Appointment.Status.Completed);
                a8.setComment("Patient had an eye infection, prescribed eye drops and oral antibiotics.");
                a8.setFeedback("The infection reduced significantly, and I’m feeling much better.");
                appointmentRepo.save(a8);

                Appointment a9 = new Appointment();
                a9.setDoctor(doctor1);  // doctor1 is assumed to be Doctor House
                a9.setPatient(patient2);  // You can assign any patient here
                a9.setStartingTime(LocalDateTime.of(2025, 11, 17, 16, 0));
                a9.setDurationInMinutes(30L);  // REQUIRED to avoid crash
                a9.setStatus(Appointment.Status.Completed);
                a9.setComment("Patient had symptoms of food poisoning. Prescribed medication and hydration guidelines.");
                a9.setFeedback("Symptoms improved after a few hours, and I followed the doctor’s instructions.");
                appointmentRepo.save(a9);

                Appointment a10 = new Appointment();
                a10.setDoctor(doctor1);
                a10.setPatient(patient);
                a10.setStartingTime(LocalDateTime.of(2025, 11, 5, 11, 0));
                a10.setDurationInMinutes(30L);
                a10.setStatus(Appointment.Status.Completed);
                a10.setComment("Routine check-up. Recommended vitamins and regular exercise.");
// No feedback → eligible for review
                appointmentRepo.save(a10);

                Appointment a11 = new Appointment();
                a11.setDoctor(doctor1);
                a11.setPatient(patient);
                a11.setStartingTime(LocalDateTime.of(2025, 11, 7, 16, 30));
                a11.setDurationInMinutes(30L);
                a11.setStatus(Appointment.Status.Completed);
                a11.setComment("Follow-up consultation. Symptoms improving. Scheduled next visit.");
// No feedback → eligible for review
                appointmentRepo.save(a11);

                Appointment a12 = new Appointment();
                a12.setDoctor(doctor1);
                a12.setPatient(patient2);
                a12.setStartingTime(LocalDateTime.of(2025, 11, 18, 9, 30));
                a12.setDurationInMinutes(30L);
                a12.setStatus(Appointment.Status.Completed);
                a12.setComment("General consultation, recommended follow-up.");
                appointmentRepo.save(a12);

                Appointment a13 = new Appointment();
                a13.setDoctor(doctor1);
                a13.setPatient(patient3);
                a13.setStartingTime(LocalDateTime.of(2025, 11, 19, 10, 0));
                a13.setDurationInMinutes(30L);
                a13.setStatus(Appointment.Status.Completed);
                a13.setComment("Headache complaints, prescribed medication.");
                appointmentRepo.save(a13);

                Appointment a14 = new Appointment();
                a14.setDoctor(doctor1);
                a14.setPatient(patient4);
                a14.setStartingTime(LocalDateTime.of(2025, 11, 20, 13, 30));
                a14.setDurationInMinutes(30L);
                a14.setStatus(Appointment.Status.Completed);
                a14.setComment("Routine check-up, all normal.");
                appointmentRepo.save(a14);

                Appointment a15 = new Appointment();
                a15.setDoctor(doctor2);
                a15.setPatient(patient5);
                a15.setStartingTime(LocalDateTime.of(2025, 11, 21, 15, 0));
                a15.setDurationInMinutes(30L);
                a15.setStatus(Appointment.Status.Completed);
                a15.setComment("Mild flu symptoms, provided treatment plan.");
                appointmentRepo.save(a15);

                Appointment a16 = new Appointment();
                a16.setDoctor(doctor2);
                a16.setPatient(patient6);
                a16.setStartingTime(LocalDateTime.of(2025, 11, 22, 11, 45));
                a16.setDurationInMinutes(30L);
                a16.setStatus(Appointment.Status.Completed);
                a16.setComment("Skin irritation, recommended ointment.");
                appointmentRepo.save(a16);

                appointmentRepo.save(a1);
                appointmentRepo.save(a2);


                System.out.println("✅ Users, doctors, schedules, and appointments seeded successfully!");
            }
        };
    }


}
