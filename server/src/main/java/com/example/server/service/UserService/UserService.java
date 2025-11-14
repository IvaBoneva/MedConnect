package com.example.server.service.UserService;

import com.example.server.models.User;
import com.example.server.repository.UserRepositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService extends BaseUserServiceImpl<User> {

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        super(userRepository, passwordEncoder);
    }

}