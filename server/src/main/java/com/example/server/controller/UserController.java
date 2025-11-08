package com.example.server.controller;


import com.example.server.config.JwtGeneratorInterface;
import com.example.server.models.User;
import com.example.server.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
//@RequestMapping("api/v1/user")
@RequestMapping("api/user")
public class UserController {

    private final UserService userService;
    private final JwtGeneratorInterface jwtGeneratorInterface;

    public UserController(UserService userService, JwtGeneratorInterface jwtGeneratorInterface){
        this.userService = userService;
        this.jwtGeneratorInterface = jwtGeneratorInterface;
    }

    @PostMapping("/register")
    public ResponseEntity<?> postUser (@RequestBody User user) {
        try{
            userService.saveUser(user);
//            return ResponseEntity.ok();
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user){

        try {
            if (user.getUsername() == null || user.getPassword() == null) {
                throw new UsernameNotFoundException("UserName or Password is Empty");
            }
            User userData = userService.getUserByNameAndPassword(user.getUsername(), user.getPassword());
            if(userData == null) {
                throw new UsernameNotFoundException("UserName or Password is Invalid");
            }
            return new ResponseEntity<>(jwtGeneratorInterface.generateToken(user), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }



}
