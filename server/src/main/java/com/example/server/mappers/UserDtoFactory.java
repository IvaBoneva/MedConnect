package com.example.server.mappers;

import com.example.server.dto.ExposedUserDTO.UserDTO;
import com.example.server.mappers.UserMappers.DoctorMapper;
import com.example.server.mappers.UserMappers.GuardianMapper;
import com.example.server.mappers.UserMappers.PatientMapper;
import com.example.server.mappers.UserMappers.UserMapper;
import com.example.server.models.UserModels.Doctor;
import com.example.server.models.UserModels.Guardian;
import com.example.server.models.UserModels.Patient;
import com.example.server.models.UserModels.User;
import org.springframework.stereotype.Component;

@Component
public class UserDtoFactory {

    private final PatientMapper patientMapper;
    private final UserMapper userMapper;
    private final DoctorMapper doctorMapper;
    private final GuardianMapper guardianMapper;


    public UserDtoFactory(PatientMapper patientMapper, UserMapper userMapper, DoctorMapper doctorMapper, GuardianMapper guardianMapper) {
        this.patientMapper = patientMapper;
        this.userMapper = userMapper;
        this.doctorMapper = doctorMapper;
        this.guardianMapper = guardianMapper;
    }

    public UserDTO getUserDTO(User user){
        if (user instanceof Doctor) {
            return doctorMapper.convertToDTO((Doctor) user);
        } else if (user instanceof Patient){
            return patientMapper.convertToDTO((Patient) user);
        } else if (user instanceof Guardian) {
            return guardianMapper.convertToDTO((Guardian) user);
        }
        return userMapper.convertToDTO(user);
    }


}
