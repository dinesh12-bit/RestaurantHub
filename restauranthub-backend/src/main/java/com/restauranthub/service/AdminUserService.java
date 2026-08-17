package com.restauranthub.service;

import com.restauranthub.dto.response.AdminUserResponse;
import com.restauranthub.entity.User;
import com.restauranthub.exception.ResourceNotFoundException;
import com.restauranthub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =====================================================
    // GET ALL USERS
    // =====================================================

    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =====================================================
    // GET USER BY ID
    // =====================================================

    public AdminUserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        return toResponse(user);
    }

    // =====================================================
    // ENABLE / DISABLE USER
    // =====================================================

    @Transactional
    public AdminUserResponse toggleUserStatus(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        user.setEnabled(
                !Boolean.TRUE.equals(user.getEnabled())
        );

        User updatedUser =
                userRepository.save(user);

        return toResponse(updatedUser);
    }

    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private AdminUserResponse toResponse(User user) {

        return AdminUserResponse.builder()

                .id(user.getId())

                .fullName(user.getFullName())

                .email(user.getEmail())

                .phone(user.getPhone())

                .role(user.getRole())

                .enabled(user.getEnabled())

                .build();
    }
}