package com.restauranthub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private String message;

    private Long userId;

    private String fullName;

    private String email;

    private String role;
}