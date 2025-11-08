package com.example.server.service;

import com.example.server.models.User;
import com.example.server.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void saveUser(User user) {
        userRepository.save(user);
    }

    @Override
    public User getUserByNameAndPassword(String name, String password) throws UsernameNotFoundException {

        User user = userRepository.findByUsernameAndPassword(name,password);
        if (user == null){
            throw new UsernameNotFoundException("Invalid id and password");
        }
        return user;
    }
}
