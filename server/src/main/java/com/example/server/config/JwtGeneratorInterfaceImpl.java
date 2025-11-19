package com.example.server.config;

import com.example.server.models.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

// TODO: Token Blacklisting (not mandatory)
@Service
public class JwtGeneratorInterfaceImpl implements JwtGeneratorInterface {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.message}")
    private String message;

    /*@Override
    public Map<String, String> generateToken(User user) {

        String jwtToken;
        jwtToken = Jwts.builder()
                .claims()
                // Begins adding claims (payload info).

                // subject is put into the token - ACTUAL INFO IN IT
                .subject(user.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                // 24 minutes xD
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                .and()
                // end of jwt builder back to main one

                .signWith(getSignInKey())
                .compact();

        Map<String, String> jwtTokenGen = new HashMap<>();
        jwtTokenGen.put("token", jwtToken);
        jwtTokenGen.put("message", message);

        return jwtTokenGen;
    }*/

   @Override
public Map<String, Object> generateToken(User user) {
    String jwtToken = Jwts.builder()
            .setSubject(user.getEmail())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24)) // 24 минути
            .signWith(getSignInKey())
            .compact();

    Map<String, Object> jwtTokenGen = new HashMap<>();
    jwtTokenGen.put("token", jwtToken);
    jwtTokenGen.put("message", "Login Successful");

    // добавяме реалните полета на потребителя
    jwtTokenGen.put("firstName", user.getFirstName());
    jwtTokenGen.put("lastName", user.getLastName());
    jwtTokenGen.put("role", user.getRole());
    jwtTokenGen.put("email", user.getEmail());

    return jwtTokenGen;
}


    private Key getSignInKey() {
        byte[] keyBytes = this.secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
