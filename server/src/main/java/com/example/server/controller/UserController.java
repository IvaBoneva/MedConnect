package com.example.server.controller;


import com.example.server.config.JwtGeneratorInterface;
import com.example.server.models.User;
import com.example.server.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
//@RequestMapping("api/v1/user")
@RequestMapping("api/user")
public class UserController {

    private final UserService userService;
    private final JwtGeneratorInterface jwtGeneratorInterface;
    private final PasswordEncoder passwordEncoder;


    public UserController(UserService userService, JwtGeneratorInterface jwtGeneratorInterface,PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtGeneratorInterface = jwtGeneratorInterface;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody User user) {

        try {
            userService.saveUser(user);
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

//        username : test_user_new, pass : test123A!

        try {
            if (user.getEmail() == null || user.getPassword() == null) {
                throw new UsernameNotFoundException("UserName or Password is Empty");
            }
            User userData = userService.getUserByEmail(user.getName());
            if (userData == null) {
                throw new UsernameNotFoundException("User with this username not registered");
            }
            if (!passwordEncoder.matches(user.getPassword(), userData.getPassword())){
                throw new UsernameNotFoundException("Wrong PASSWORD");
            }
            return new ResponseEntity<>(jwtGeneratorInterface.generateToken(user), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    //    Just remove the token from the client
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Just acknowledge logout
            return ResponseEntity.ok("User logged out — token discarded on client.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No token provided.");
    }


}
