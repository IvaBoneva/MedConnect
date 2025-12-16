package com.example.server.service.UserServices;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.example.server.repository.CalendarRepositories.WeeklyScheduleTemplateRepository;
import com.example.server.repository.StorageRepositories.StorageRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.server.dto.ExposedUserDTO.DoctorDTO;
import com.example.server.dto.ExposedUserDTO.GuardianDTO;
import com.example.server.mappers.UserMappers.DoctorMapper;
import com.example.server.models.CalendarModels.WeeklyScheduleTemplate;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Guardian;
import com.example.server.repository.UserRepositories.DoctorRepository;

@Service
public class DoctorService extends BaseUserServiceImpl<Doctor> {

    private final DoctorMapper doctorMapper;
    private final DoctorRepository doctorRepository; // Add this specific repository
    private final WeeklyScheduleTemplateRepository weeklyScheduleTemplateRepository;

    public DoctorService(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder, DoctorMapper doctorMapper,
            DoctorRepository doctorRepository1, StorageRepository storageRepository, WeeklyScheduleTemplateRepository weeklyScheduleTemplateRepository) {
        super(doctorRepository, passwordEncoder, storageRepository);
        this.doctorMapper = doctorMapper;
        this.doctorRepository = doctorRepository1;
        this.weeklyScheduleTemplateRepository = weeklyScheduleTemplateRepository;
    }

    public List<DoctorDTO> getAllDoctorsDTO() {
        List<Doctor> doctorsList = this.getAll();
        return doctorsList
                .stream()
                .map(doctorMapper::convertToDTO)
                .toList();
    }

    public Doctor findById(Long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        return doctor.orElseThrow(() -> new RuntimeException("Guardian not found with id " + id));
    }

    public DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO) {
        Doctor existingDoctor = findById(id);

        if (doctorDTO.getPhotoURL() != null) {
            existingDoctor.setPhotoURL(doctorDTO.getPhotoURL());
        }

        existingDoctor.setFirstName(doctorDTO.getFirstName());
        existingDoctor.setLastName(doctorDTO.getLastName());
        existingDoctor.setAge(doctorDTO.getAge());
        existingDoctor.setEmail(doctorDTO.getEmail());
        existingDoctor.setPhoneNumber(doctorDTO.getPhoneNumber());

        existingDoctor.setSpecialization(doctorDTO.getSpecialization());
        existingDoctor.setYearsOfExperience(doctorDTO.getYearsOfExperience());
        existingDoctor.setCity(doctorDTO.getCity());
        existingDoctor.setHospital(doctorDTO.getHospital());

        Doctor updatedDoctor = doctorRepository.save(existingDoctor);
        return doctorMapper.convertToDTO(updatedDoctor);

    }

    public DoctorDTO getDoctorBySlug(String slug) {
        Optional<Doctor> doctorOpt = doctorRepository.findBySlug(slug);
        return doctorOpt.map(doctorMapper::convertToDTO).orElse(null);
    }

    public void createDefaultWeeklyScheduleForDoctor(Doctor doctor)
    {
      List<WeeklyScheduleTemplate> schedules = new ArrayList<>();

      for(DayOfWeek day : DayOfWeek.values())
        {
            WeeklyScheduleTemplate schedule = new WeeklyScheduleTemplate();
            schedule.setDoctor(doctor);
            schedule.setDayOfWeek(day);

            if(day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY)
            {
                schedule.setWorking(false);
            }
            else
            {
                schedule.setWorking(true);
                schedule.setStartTime(LocalTime.of(9,0));
                schedule.setEndTime(LocalTime.of(17,0 ));
                schedule.setSlotDurationMinutes(30);
            }

            schedules.add(schedule);
        }

        weeklyScheduleTemplateRepository.saveAll(schedules);
    }

}