package com.example.server.controller;

import com.example.server.models.UserModels.User;
import com.example.server.service.JwtService;
import com.example.server.service.UserServices.BaseUserService;
import com.example.server.service.CalendarServices.GoogleCalendarService;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.services.calendar.model.Event;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import javax.crypto.SecretKey;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;


//USER → (click Login with Google)
//        → Redirect to Google OAuth URL
//     → User logs in
//     → Google redirects back to YOUR redirect URI with ?code=XXXXX
//
//Your backend GET /google/callback?code=XXXXX
//                         ↓
//exchange code for tokens
//                         ↓
//you store tokens in DB


@RestController
public class GoogleController {

    private final GoogleCalendarService googleCalendarService;
    private final BaseUserService<User> baseUserService;
    private final JwtService jwtService;


    public GoogleController(GoogleCalendarService googleCalendarService, BaseUserService<User> baseUserService, JwtService jwtService) {
        this.googleCalendarService = googleCalendarService;
        this.baseUserService = baseUserService;
        this.jwtService = jwtService;
    }

    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback(@RequestParam(required = false) String code,
                                            @RequestParam(required = false) String state,
                                            @RequestParam(required = false) String error,
                                            HttpServletResponse response) throws Exception {

        TokenResponse tokens = googleCalendarService.exchangeCodeForTokens(code);

//        Here state = token

        String email = jwtService.extractEmail(state);

        User user = baseUserService.getUserByEmail(email);

        if (user == null) {
            System.out.println("User is KINDA NULL");
            return ResponseEntity.ok("Wrong mail G" + email);
        }

        user.setGoogleAccessToken(tokens.getAccessToken());
        user.setGoogleRefreshToken(tokens.getRefreshToken());

        baseUserService.saveGoogleTokensToUser(user);


        response.sendRedirect("http://localhost:3000");
        return ResponseEntity.ok("Google token set properly");
    }

    @GetMapping("/google")
    public void redirectToGoogle(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        String url =
                "https://accounts.google.com/o/oauth2/v2/auth" +
                        "?client_id=475557739996-mbt6vurj2qb7q3lafa78970vio0q5kru.apps.googleusercontent.com" +
                        "&redirect_uri=http://localhost:8080/google/callback" +
                        "&response_type=code" +
                        "&scope=https://www.googleapis.com/auth/calendar.readonly" +
                        "&access_type=offline" +
                        "&prompt=consent" +
        "&state=" + URLEncoder.encode(token, StandardCharsets.UTF_8);

        response.sendRedirect(url);
    }

//    @GetMapping("refresh")
//    public String refreshAccessToken(String refreshToken) throws Exception {
//        // Use the refresh token to get a new access token
//        TokenResponse refreshedTokens = googleCalendarService.exchangeCodeForTokens(refreshToken);
//        return refreshedTokens.getAccessToken();
//    }

    @GetMapping("/events")
    public ResponseEntity<?> listEvents(HttpServletRequest request) {
        try {

            final String secret = "supersecretkeysupersecretkey123456"; // same as application.yml
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));


            String authHeader = request.getHeader("Authorization");
            String token2 = authHeader.substring(7);

            String email = jwtService.extractEmail(token2);

            User user = baseUserService.getUserByEmail(email);

            String googleAccessToken = user.getGoogleAccessToken();

            // Assuming the token is the access_token sent by frontend
            Credential userCredential = googleCalendarService.buildCredential(googleAccessToken, null); // null as no refresh_token needed for now

            // Fetch upcoming events
            List<Event> events = googleCalendarService.listUpcomingEvents(userCredential);

            // Return the events as a response
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            // Handle any error (e.g., invalid token, expired token)
            return ResponseEntity.status(500).body("Error fetching events: " + e.getMessage());
        }
    }


}
