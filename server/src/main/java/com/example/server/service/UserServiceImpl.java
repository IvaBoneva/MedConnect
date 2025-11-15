package com.example.server.service;

import com.example.server.models.User;
import com.example.server.repository.UserRepositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl extends BaseUserServiceImpl<User> {

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        super(userRepository, passwordEncoder);
    }

}