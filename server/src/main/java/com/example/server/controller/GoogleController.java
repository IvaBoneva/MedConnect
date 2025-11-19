package com.example.server.controller;

import com.example.server.service.GoogleCalendarService;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.io.IOException;
import java.security.GeneralSecurityException;
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

//    private String accessToken;
//
//    private String refreshToken;


    public GoogleController(GoogleCalendarService googleCalendarService) {
        this.googleCalendarService = googleCalendarService;
    }

    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback(@RequestParam("code") String code) throws Exception {
        TokenResponse tokens = googleCalendarService.exchangeCodeForTokens(code);
        String accessToken = tokens.getAccessToken();
        String refreshToken = tokens.getRefreshToken();

//        Credential userCredential = googleCalendarService.buildCredential(accessToken,refreshToken);

        return ResponseEntity.ok(tokens);
    }

    @GetMapping("/google")
    public void redirectToGoogle(HttpServletResponse response) throws IOException {
        String url =
                "https://accounts.google.com/o/oauth2/v2/auth" +
                        "?client_id=475557739996-mbt6vurj2qb7q3lafa78970vio0q5kru.apps.googleusercontent.com" +
                        "&redirect_uri=http://localhost:8080/google/callback" +
                        "&response_type=code" +
                        "&scope=https://www.googleapis.com/auth/calendar.readonly" +
                        "&access_type=offline" +
                        "&prompt=consent";

        response.sendRedirect(url);
    }

//    @GetMapping("refresh")
//    public String refreshAccessToken(String refreshToken) throws Exception {
//        // Use the refresh token to get a new access token
//        TokenResponse refreshedTokens = googleCalendarService.exchangeCodeForTokens(refreshToken);
//        return refreshedTokens.getAccessToken();
//    }

    @GetMapping("/events")
    public ResponseEntity<?> listEvents(@RequestBody String token) {
        try {
            // Assuming the token is the access_token sent by frontend
            Credential userCredential = googleCalendarService.buildCredential(token, null); // null as no refresh_token needed for now

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
