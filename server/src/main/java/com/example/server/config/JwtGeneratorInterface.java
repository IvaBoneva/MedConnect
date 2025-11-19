package com.example.server.config;

import com.example.server.models.User;
import java.util.Map;

public interface JwtGeneratorInterface {
    //Map<String, String> generateToken(User user);
    Map<String, Object> generateToken(User user);
}
