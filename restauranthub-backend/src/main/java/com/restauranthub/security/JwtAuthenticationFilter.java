package com.restauranthub.security;

import com.restauranthub.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // ========================================
        // DEBUG
        // ========================================

        System.out.println();
        System.out.println("========== JWT FILTER ==========");
        System.out.println("Request URI : " + request.getRequestURI());
        System.out.println("Method      : " + request.getMethod());

        String authHeader = request.getHeader("Authorization");

        System.out.println(
                "Authorization Header Exists : "
                        + (authHeader != null)
        );

        // ========================================
        // NO TOKEN
        // ========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println(
                    "NO VALID BEARER TOKEN"
            );

            System.out.println(
                    "================================"
            );

            filterChain.doFilter(request, response);
            return;
        }

        // ========================================
        // EXTRACT TOKEN
        // ========================================

        String jwt = authHeader.substring(7);

        System.out.println("JWT Token received");

        try {

            // ========================================
            // EXTRACT EMAIL
            // ========================================

            String userEmail =
                    jwtService.extractUsername(jwt);

            System.out.println(
                    "Email from JWT : " + userEmail
            );

            // ========================================
            // AUTHENTICATE USER
            // ========================================

            if (userEmail != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(userEmail);

                System.out.println(
                        "User found : "
                                + userDetails.getUsername()
                );

                System.out.println(
                        "Authorities : "
                                + userDetails.getAuthorities()
                );

                // ========================================
                // VALIDATE TOKEN
                // ========================================

                if (jwtService.isTokenValid(
                        jwt,
                        userDetails)) {

                    UsernamePasswordAuthenticationToken
                            authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);

                    System.out.println(
                            "JWT AUTHENTICATION SUCCESS"
                    );

                } else {

                    System.out.println(
                            "JWT TOKEN INVALID OR EXPIRED"
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT ERROR : " + e.getMessage()
            );

        }

        System.out.println(
                "================================"
        );

        filterChain.doFilter(request, response);
    }
}