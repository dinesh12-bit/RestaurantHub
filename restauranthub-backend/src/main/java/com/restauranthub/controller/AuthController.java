package com.restauranthub.controller;

import com.restauranthub.dto.response.AuthResponse;
import com.restauranthub.dto.request.LoginRequest;
import com.restauranthub.dto.request.RegisterRequest;
import com.restauranthub.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PutMapping("/reset-admin-password")
    public String resetAdminPassword() {

        userService.resetAdminPassword(
                "rahulnew@gmail.com",
                "Admin@123"
        );

        return "Admin password reset successfully";
    }
}