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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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

        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(Customizer.withDefaults());


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

                        "/events",

                        "/auth/me",

                        "/api/aiDoctor/sayHello",
                        "/api/aiDoctor/callGemini",


                        "/api/storage/files",
                        "/api/storage/getFiles/**",
                        "/api/storage/files/{fileId}",

                        "/api/appointments/patient/**",
                        "/api/appointment/guardian/**",

                        "/api/prescription-events/user/\\d+",


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

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://med-connect-psi-nine.vercel.app",
                "https://med-connect-b9bmw148l-bobi759s-projects.vercel.app/"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);
        return source;
    }
}