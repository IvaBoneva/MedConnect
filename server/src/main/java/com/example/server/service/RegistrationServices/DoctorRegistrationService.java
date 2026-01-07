package com.example.server.service.RegistrationServices;

import com.example.server.repository.RegistrationRepositories.DoctorRegistrationRequestRepository;
import com.example.server.models.RegistrationModels.DoctorRegisterRequest;
import com.example.server.models.UserModels.Doctor;
import com.example.server.repository.UserRepositories.DoctorRepository;
import com.example.server.dto.ExposedUserDTO.DoctorRegisterRequestDTO;
import com.example.server.mappers.RegistrationMappers.DoctorRegistrationMapper;
import com.example.server.models.StorageModels.Storage;
import com.example.server.repository.StorageRepositories.StorageRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.LocalDate;
import java.time.Instant;
import java.util.List;

@Service
public class DoctorRegistrationService {

    private final DoctorRegistrationRequestRepository regRequestRepo;
    private final DoctorRepository doctorRepo;
    private final PasswordEncoder passwordEncoder;
    private final DoctorRegistrationMapper mapper;
    private final StorageRepository storageRepository;


    @Autowired
    public DoctorRegistrationService(DoctorRegistrationRequestRepository regRequestRepo, DoctorRepository doctorRepo, 
    PasswordEncoder passwordEncoder, DoctorRegistrationMapper mapper, StorageRepository storageRepository) {
        this.regRequestRepo = regRequestRepo;
        this.doctorRepo = doctorRepo;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
        this.storageRepository = storageRepository;
    }

    public DoctorRegisterRequest createRequest(DoctorRegisterRequest dto){

        if (doctorRepo.findByEmail(dto.getEmail()) != null) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (regRequestRepo.existsByEmailAndStatus(dto.getEmail(), DoctorRegisterRequest.Status.PENDING)) {
            throw new IllegalArgumentException("There is already a pending request for this email");
        }

        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        dto.setStatus(DoctorRegisterRequest.Status.PENDING);

        return regRequestRepo.save(dto);

    }

        public List<DoctorRegisterRequestDTO> getPendingRequestsDTO(){
            List<DoctorRegisterRequest> requests = regRequestRepo.findAll().stream()
            .filter(r -> r.getStatus() == DoctorRegisterRequest.Status.PENDING)
            .toList();
            return requests.stream()
                .map(mapper::convertToDTO)
                .toList();
        }

        public void acceptRequest(Long requestId){
            DoctorRegisterRequest request= regRequestRepo.findById(requestId)
            .orElseThrow(() -> new IllegalArgumentException("Request not found"));

            if(request.getStatus() != DoctorRegisterRequest.Status.PENDING) {
                throw new IllegalStateException("Request already processed");
            }

            Doctor doctor = new Doctor();
            doctor.setFirstName(request.getFirstName());
            doctor.setLastName(request.getLastName());
            doctor.setEmail(request.getEmail());
            doctor.setPassword(request.getPassword());
            doctor.setPhoneNumber(request.getPhoneNumber());

            doctor.setSpecialization(request.getSpecialization());
            doctor.setYearsOfExperience(request.getYearsOfExperience());
            doctor.setCity(request.getCity());
            doctor.setHospital(request.getHospital());

            doctor.setSubscription("free");
            doctor.setSubscriptionExpiry(LocalDate.now().plusYears(100));


            Storage storage = new Storage();
            storage.setUser(doctor);
            storageRepository.save(storage);


            doctorRepo.save(doctor);
            request.setStatus(DoctorRegisterRequest.Status.ACCEPTED);
            regRequestRepo.save(request);

        }

        public void denyRequest(Long requestId) {

            DoctorRegisterRequest request= regRequestRepo.findById(requestId)
            .orElseThrow(() -> new IllegalArgumentException("Request not found"));

            if(request.getStatus() != DoctorRegisterRequest.Status.PENDING) {
                throw new IllegalStateException("Request already processed");
            }

            request.setStatus(DoctorRegisterRequest.Status.DENIED);

            regRequestRepo.save(request);

        }

}