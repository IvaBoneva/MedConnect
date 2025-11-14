package com.example.server.service.UserService;
import com.example.server.models.Guardian;
import com.example.server.repository.UserRepositories.GuardianRepository;
import com.example.server.service.UserService.BaseUserServiceImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class GuardianService extends BaseUserServiceImpl<Guardian> {
    public GuardianService(GuardianRepository guardianRepository, PasswordEncoder passwordEncoder) {
        super(guardianRepository, passwordEncoder);
    }
}