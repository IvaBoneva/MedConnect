package com.example.server.service;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.ClientParametersAuthentication;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import org.springframework.stereotype.Service;

import java.io.InputStreamReader;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Objects;

@Service
public class GoogleCalendarService {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String CREDENTIALS_FILE_PATH = "/credentials.json";
    private static final String APPLICATION_NAME = "Med connect";

    private static final String REDIRECT_URI = "http://localhost:8080/google/callback";

    /**
     * Exchange Google OAuth "code" for tokens
     */
    public TokenResponse exchangeCodeForTokens(String code) throws Exception {

        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        GoogleClientSecrets secrets = GoogleClientSecrets.load(
                JSON_FACTORY,
                new InputStreamReader(Objects.requireNonNull(getClass().getResourceAsStream(CREDENTIALS_FILE_PATH)))
        );

        return new GoogleAuthorizationCodeTokenRequest(
                httpTransport,
                JSON_FACTORY,
                secrets.getDetails().getClientId(),
                secrets.getDetails().getClientSecret(),
                code,
                REDIRECT_URI
        ).execute();
    }


    /**
     * Build credential object using stored tokens
     */
    public Credential buildCredential(String accessToken, String refreshToken) throws Exception {

        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        GoogleClientSecrets secrets = GoogleClientSecrets.load(
                JSON_FACTORY,
                new InputStreamReader(Objects.requireNonNull(getClass().getResourceAsStream(CREDENTIALS_FILE_PATH)))
        );

        return new Credential.Builder(BearerToken.authorizationHeaderAccessMethod())
                .setTransport(httpTransport)
                .setJsonFactory(JSON_FACTORY)
                .setTokenServerEncodedUrl(secrets.getDetails().getTokenUri())
                .setClientAuthentication(
                        new ClientParametersAuthentication(
                                secrets.getDetails().getClientId(),
                                secrets.getDetails().getClientSecret()
                        )
                )
                .build()
                .setAccessToken(accessToken)
                .setRefreshToken(refreshToken);
    }


    /**
     * Fetch events for a user
     */
    public List<Event> listUpcomingEvents(Credential credential)
            throws IOException, GeneralSecurityException {

        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        Calendar service = new Calendar.Builder(
                httpTransport,
                JSON_FACTORY,
                credential
        ).setApplicationName(APPLICATION_NAME).build();

        Events events = service.events().list("primary")
                .setSingleEvents(true)
                .setOrderBy("startTime")
                .setMaxResults(10)
                .setTimeMin(new com.google.api.client.util.DateTime(System.currentTimeMillis()))
                .execute();

        return events.getItems();
    }




//    private GoogleClientSecrets getClientSecrets() throws IOException {
//        return GoogleClientSecrets.load(
//                JSON_FACTORY,
//                new InputStreamReader(Objects.requireNonNull(getClass().getResourceAsStream(CREDENTIALS_FILE_PATH)))
//        );
//    }
}
