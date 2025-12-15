package com.example.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

//@EnableMethodSecurity(prePostEnabled = true)
@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // disable CSRF since we use fronted (any other port, not server side rendered
        // app)
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(Customizer.withDefaults()); // ✅ Enable the CORS config you defined

        // permit specific request (3), other authenticated (using our JWT filter)
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/api/user/**",
                        "/api/user/register",
                        "/api/blog/unrestricted",
                        "/api/stripe/webhook",
                        "/api/stripe/**", "/api/user/guardians",
                        "/api/user/patients",
                        "/api/user/doctors",

                        "/api/user/doctor/register",
                        "/api/user/patient/register",
                        "/api/user/guardian/register",

                        "/api/workDays/allWorkDays",

//                        "/google",
//                        "/google/callback",


                        "/google",
                        "/google/*",
                        "/google/**",

                        "/events",

                        "/auth/me",

                        "/api/aiDoctor/sayHello",
                        "/api/aiDoctor/callGemini",


                        "/api/storage/files",      // Public file upload endpoint
                        "/api/storage/getFiles/**",
                        "/api/storage/files/{fileId}", // Protected file deletion endpoint (JWT required)



                        "/api/calendar/doctor",
                        "/api/calendar/doctor/off",
                        "/api/calendar/doctor/*/exception",

                        "/api/appointments",
                        "/api/appointments/pastUserAppointments",
                        "/api/appointments/**",

                        "/guardians",
                        "/api/user/doctor/register",
                        "/api/stripe/**")
                .permitAll()
                .anyRequest().authenticated());

        // .permitAll()
        // .anyRequest().authenticated());

        // don't use sessions because again we use JWT
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // runs before the UsernamePassword filter
        // but since we added the user to trusted/authenticated users in the aut local
        // storage (see JwtFilter.java)
        // the logic of UsernamePasswordAuthenticationFilter is skipped since user
        // already trusted
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}