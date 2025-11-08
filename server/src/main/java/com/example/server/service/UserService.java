package com.example.server.service;


import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.server.models.User;


@Service
public interface UserService {

    public void saveUser(User user);

    public User getUserByNameAndPassword(String name, String password) throws UsernameNotFoundException;

}
