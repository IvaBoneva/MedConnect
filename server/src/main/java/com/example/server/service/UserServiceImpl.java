package com.example.server.service;

import com.example.server.models.Role;
import com.example.server.models.RolesEnum;
import com.example.server.models.User;
import com.example.server.repository.UserRepository;
import jakarta.persistence.CascadeType;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.ManyToMany;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User getUserByEmail(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email);
        if (user == null){
            throw new UsernameNotFoundException("Invalid id and password");
        }
        return user;
    }

    @Override
    public void saveUser(User user) throws EntityExistsException {

        if (userRepository.findByEmail(user.getEmail()) != null){
            throw new EntityExistsException("Entity already registered");
        }
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userRepository.save(user);

    }
}
