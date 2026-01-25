package com.example.server.config;

import com.example.server.models.UserModels.User;
import com.example.server.service.UserServices.BaseUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.NoSuchElementException;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final BaseUserService<User> baseUserService;

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) auth.getPrincipal();
        return baseUserService.getUserByEmail(email);
    }
}