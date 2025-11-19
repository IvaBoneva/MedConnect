//package com.example.server.service;
//
//import com.example.server.models.User;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//
//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//
//    private final BaseUserService<User> baseUserService;
//
//    @Autowired
//    public CustomUserDetailsService(BaseUserService<User> baseUserService) {
//        this.baseUserService = baseUserService;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = baseUserService.getUserByEmail(username);  // Fetch the full user object from the database
//        if (user == null) {
//            throw new UsernameNotFoundException("User not found: " + username);
//        }
//        return null;
//    }
//}
