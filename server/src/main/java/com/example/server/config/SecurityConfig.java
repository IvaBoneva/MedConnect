package com.example.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
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

        // --- DEFINITIVE BYPASS: Use web.ignoring() for the webhook path ---
        // This exempts the path from ALL security filters, including your custom JWT
        // filter.
        @Bean
        public WebSecurityCustomizer webSecurityCustomizer() {
                return (web) -> web.ignoring()
                                // Explicitly ignore POST to the webhook path from ALL security filters
                                .requestMatchers(HttpMethod.POST, "/api/stripe/webhook");
        }
        // -----------------------------------------------------------------

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                // disable CSRF since we use fronted
                http.csrf(AbstractHttpConfigurer::disable);
                http.cors(Customizer.withDefaults());

                http.authorizeHttpRequests(auth -> auth

                                // Permit other general Stripe API calls (e.g., creating checkout sessions)
                                .requestMatchers("/api/stripe/**").permitAll()

                                // Permit other public API calls
                                .requestMatchers(
                                                "/api/user/**",
                                                "/api/blog/unrestricted")
                                .permitAll()

                                // All other requests must be authenticated
                                .anyRequest().authenticated());

                // don't use sessions because again we use JWT
                http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

                // runs before the UsernamePassword filter
                http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}