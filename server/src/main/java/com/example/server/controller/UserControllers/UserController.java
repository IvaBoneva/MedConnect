package com.example.server.controller.UserControllers;


import com.example.server.config.JwtGeneratorInterface;
import com.example.server.models.User;
import com.example.server.service.BaseUserService;
//import com.example.server.service.UserService.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@RequestMapping("api/v1/user")
@RequestMapping("api/user")
public class UserController {

//    CHANGED UserService -> BaseUserService

    private final BaseUserService<User> baseUserService;
    private final JwtGeneratorInterface jwtGeneratorInterface;
    private final PasswordEncoder passwordEncoder;


    public UserController(BaseUserService<User> baseUserService, JwtGeneratorInterface jwtGeneratorInterface,PasswordEncoder passwordEncoder) {
        this.baseUserService = baseUserService;
        this.jwtGeneratorInterface = jwtGeneratorInterface;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody User user) {

        try {

            baseUserService.saveUser(user);
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        try {
            if (user.getEmail() == null || user.getPassword() == null) {
                throw new UsernameNotFoundException("UserName or Password is Empty");
            }
            User userData = baseUserService.getUserByEmail(user.getEmail());
            if (userData == null) {
                throw new UsernameNotFoundException("User with this username not registered");
            }
            if (!passwordEncoder.matches(user.getPassword(), userData.getPassword())){
                throw new UsernameNotFoundException("Wrong PASSWORD");
            }
            return new ResponseEntity<>(jwtGeneratorInterface.generateToken(userData), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok("User logged out — token discarded on client.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No token provided.");
    }
//
    @GetMapping("/users")
    public List<User> getTestData(){
        return baseUserService.getAll();
    }

}
