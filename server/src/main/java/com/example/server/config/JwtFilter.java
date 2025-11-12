package com.example.server.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

@Component
public class JwtFilter extends GenericFilterBean {

        private final String secret = "supersecretkeysupersecretkey123456"; // same as application.yml

        @Override
        public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
                        throws IOException, ServletException {

                HttpServletRequest request = (HttpServletRequest) servletRequest;
                HttpServletResponse response = (HttpServletResponse) servletResponse;

                String path = request.getRequestURI();

                // Skip JWT validation for these endpoints and goes ahead in the filter chain
                if (path.startsWith("/api/user/login") ||
                                path.startsWith("/api/user/register") ||
                                path.startsWith("/api/blog/unrestricted") ||
                                path.startsWith("/api/stripe/webhook")) { // <-- Robust webhook skip

                        System.out.println("JWT Filter: Bypassing authentication for webhook path: " + path);
                        filterChain.doFilter(request, response);
                        return;
                }

                // If restricted and no token passed or other than JWT
                String authHeader = request.getHeader("Authorization");
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                                        "Missing or invalid Authorization header");
                        return;
                }

                // Cutting the info since it's sant as Bearer s7m3tOk6Nh3r3
                String token = authHeader.substring(7);

                try {
                        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
                        Claims claims = Jwts.parser()
                                        .verifyWith(key)
                                        .build()
                                        .parseSignedClaims(token)
                                        .getPayload();

                        // Set authentication context manually
                        String username = claims.getSubject();
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                        new User(username, "", Collections.emptyList()),
                                        null,
                                        Collections.emptyList());

                        SecurityContextHolder.getContext().setAuthentication(authentication);

                } catch (Exception e) {
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                        return;
                }

                filterChain.doFilter(request, response);
        }
}