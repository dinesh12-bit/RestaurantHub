package com.restauranthub.service;

import com.restauranthub.dto.response.AuthResponse;
import com.restauranthub.dto.request.LoginRequest;
import com.restauranthub.dto.request.RegisterRequest;
import com.restauranthub.entity.User;
import com.restauranthub.entity.enums.Role;
import com.restauranthub.repository.UserRepository;
import com.restauranthub.security.CustomUserDetails;
import com.restauranthub.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }


    // =========================
    // REGISTER
    // =========================

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User user = User.builder()

                .fullName(request.getFullName())

                .email(request.getEmail())

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .phone(request.getPhone())

                .role(Role.CUSTOMER)

                .enabled(true)

                .build();


        User savedUser = userRepository.save(user);


        return new AuthResponse(
                null,
                "Registration Successful",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }


    // =========================
    // LOGIN
    // =========================

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getEmail(),

                        request.getPassword()

                )
        );


        User user = userRepository
                .findByEmail(request.getEmail())

                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );


        String token = jwtService.generateToken(

                new CustomUserDetails(user)

        );


        return new AuthResponse(
                token,
                "Login Successful",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
    }


    // =========================
    // RESET ADMIN PASSWORD
    // =========================

    public void resetAdminPassword(
            String email,
            String newPassword) {

        User user = userRepository
                .findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );


        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        user.setRole(Role.ADMIN);

        userRepository.save(user);
    }
}