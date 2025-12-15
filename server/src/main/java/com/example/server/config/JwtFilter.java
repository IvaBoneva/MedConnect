package com.example.server.config;

import com.example.server.models.UserModels.User;
import com.example.server.service.UserServices.BaseUserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

@Component
public class JwtFilter extends GenericFilterBean {

    private final String secret = "supersecretkeysupersecretkey123456"; // same as application.yml

    private final BaseUserService<User> baseUserService;

    public JwtFilter(@Lazy BaseUserService<User> baseUserService) {
        this.baseUserService = baseUserService;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String servletPath = request.getServletPath();
        String method = request.getMethod();

        if (servletPath.startsWith("/api/user/login") ||
                servletPath.startsWith("/api/user/register") ||
                servletPath.startsWith("/api/blog/unrestricted") ||
                servletPath.startsWith("/api/user/users") ||


                servletPath.startsWith("/api/user/guardians") ||
                servletPath.startsWith("/api/user/patients") ||
                servletPath.startsWith("/api/user/doctors") ||

                servletPath.startsWith("/api/workDays/allWorkDays") ||

                servletPath.startsWith("/api/user/doctor/register") ||
                servletPath.startsWith("/api/user/patient/register") ||
                servletPath.startsWith("/api/user/guardian/register") ||

                servletPath.startsWith("/api/calendar/doctor") ||

                servletPath.startsWith("/api/aiDoctor") ||
                servletPath.matches("/api/aiDoctor/callHello") ||


                servletPath.startsWith("/api/storage/files") ||  // <-- This is the public file endpoint

                servletPath.startsWith("/api/storage/getFiles/") ||  // <-- Add this line to allow this URL
                servletPath.startsWith("/api/storage/**") ||  //


            servletPath.startsWith("/api/calendar/doctor/off") ||

                servletPath.matches("/api/calendar/doctor/\\d+/exception") ||

                servletPath.matches("/api/appointments") ||

                servletPath.contains("/google") ||
//                servletPath.equals("/google/callback") ||
                                servletPath.startsWith("/events") ||

                servletPath.equals("/auth/me") ||

                servletPath.matches("/api/appointments/doctor") ||
                servletPath.matches("/api/appointments/pastUserAppointments") ||
                servletPath.matches("/api/appointments/\\d+/feedback") ||


                servletPath.matches("/api/storage/files") ||


                servletPath.equals("/api/stripe/webhook") ||
                servletPath.startsWith("/api/stripe/")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                    "Missing or invalid Authorization header");
            return;
        }

        String token = authHeader.substring(7);

        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.getSubject();
            User realUser = baseUserService.getUserByEmail(email);


//            SecurityContextHolder.getContext().setAuthentication(authentication);



            // Create authentication token with the authenticated user and set it in security context


            if (realUser != null) {
                // Set the principal as the email (String)
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }


        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
