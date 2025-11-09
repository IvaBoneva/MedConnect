package com.example.server.service;


import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.server.models.User;


@Service
public interface UserService {


    public User getUserByEmail(String name) throws UsernameNotFoundException;

    public void saveUser(User user);
}
