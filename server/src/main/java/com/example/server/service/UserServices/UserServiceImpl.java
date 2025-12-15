package com.example.server.service.UserServices;

import com.example.server.models.UserModels.User;
import com.example.server.repository.StorageRepositories.StorageRepository;
import com.example.server.repository.UserRepositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends BaseUserServiceImpl<User> {

    private final UserRepository userRepository; // Declare the userRepository field

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, StorageRepository storageRepository) {
        super(userRepository, passwordEncoder,storageRepository);
        this.userRepository = userRepository; // Initialize the userRepository

    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);

    }

}