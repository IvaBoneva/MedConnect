package com.example.server.config;

import com.example.server.models.UserModels.User;
import java.util.Map;

public interface JwtGeneratorInterface {
    Map<String, String> generateToken(User user);
}
