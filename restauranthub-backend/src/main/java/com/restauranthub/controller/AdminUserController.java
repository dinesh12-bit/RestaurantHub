package com.restauranthub.controller;

import com.restauranthub.dto.response.AdminUserResponse;
import com.restauranthub.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(
            AdminUserService adminUserService) {

        this.adminUserService =
                adminUserService;
    }

    // =====================================================
    // GET ALL USERS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>>
    getAllUsers() {

        return ResponseEntity.ok(
                adminUserService.getAllUsers()
        );
    }

    // =====================================================
    // GET USER BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponse>
    getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminUserService.getUserById(id)
        );
    }

    // =====================================================
    // ENABLE / DISABLE USER
    // =====================================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminUserResponse>
    toggleUserStatus(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminUserService.toggleUserStatus(id)
        );
    }
}